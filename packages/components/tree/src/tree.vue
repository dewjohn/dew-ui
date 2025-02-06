<script setup lang="ts">
import type {
  Key,
  TreeNode,
  TreeOption,
} from './tree'
import DewVirtualList from '@dew-ui/components/virtual-list'
import { createNameSpace } from '@dew-ui/utils/create'
import { computed, onMounted, provide, ref, useSlots, watch } from 'vue'
import {
  treeEmitts,
  treeInjectKey,
  treeProps,
} from './tree'
import DewTreeNode from './treeNode.vue'

defineOptions({
  name: 'DewTree',
})

const props = defineProps(treeProps)

// 实现选中节点
const emit = defineEmits(treeEmitts)

const bem = createNameSpace('tree')

// 有了props要对用户的数据进行格式化，格式化一个固定的结果
// label, key, children
const tree = ref<TreeNode[]>([])

// 我们将props.data 格式化后放到tree中

function createOption(key: string, label: string, children: string) {
  return {
    getKey(node: TreeOption) {
      return node[key] as string // 用户传递的key
    },
    getLabel(node: TreeOption) {
      return node[label] as string // 用户传递的label
    },
    getChildren(node: TreeOption) {
      return node[children] as TreeOption[] // 用户传递的children
    },
  }
}

const treeOptions = createOption(
  props.keyField,
  props.labelFiled,
  props.childrenField,
)
function createTree(data: TreeOption[], parent: TreeNode | null = null) {
  function traversal(data: TreeOption[], parent: TreeNode | null = null) {
    return data.map((node) => {
      const children = treeOptions.getChildren(node) || []
      const treeNode: TreeNode = {
        key: treeOptions.getKey(node),
        label: treeOptions.getLabel(node),
        children: [],
        rawNode: node,
        level: parent ? parent.level + 1 : 0,
        disabled: !!node.disabled,
        isLeaf: node.isLeaf ?? children.length === 0,
        parentKey: parent?.key,
      }
      if (children.length > 0) {
        treeNode.children = traversal(children, treeNode)
      }

      return treeNode
    })
  }
  const result: TreeNode[] = traversal(data, parent)
  return result
}

// 监控数据变化，调用格式化方法，一上来先格式化一次
watch(
  props.data,
  (data: TreeOption[]) => {
    tree.value = createTree(data)
  },
  { immediate: true },
)

// 需要展开的key有哪些
const expandedKeySet = ref(new Set(props.defaultExpandedKeys))

const flattenTree = computed(() => {
  const expandedKeys = expandedKeySet.value // 要展开的keys有哪些
  const flattenNodes: TreeNode[] = [] // 拍平之后的结果
  const nodes = tree.value || [] // 被格式化的节点
  const stack: TreeNode[] = [] // 用于被遍历的栈
  for (let i = nodes.length - 1; i >= 0; i--) {
    // 倒序放入
    stack.push(nodes[i])
  }
  // 深度遍历
  while (stack.length) {
    const node = stack.pop()
    if (!node)
      continue
    flattenNodes.push(node)
    if (expandedKeys.has(node.key)) {
      const children = node.children
      if (children) {
        for (let i = node.children.length - 1; i >= 0; i--) {
          stack.push(node.children[i])
        }
      }
    }
  }
  return flattenNodes
})

const loadingKeysRef = ref(new Set<Key>([]))

function triggerLoading(node: TreeNode) {
  // 这个节点需要异步加载
  if (!node.children.length && !node.isLeaf) {
    // 如果没有加载过这个节点，就加载这个节点
    const loadingKeys = loadingKeysRef.value
    if (!loadingKeys.has(node.key)) {
      loadingKeys.add(node.key)
      const { onLoad } = props
      if (onLoad) {
        onLoad!(node.rawNode).then((children) => {
          node.rawNode.children = children
          // 更新自定义的node
          node.children = createTree(children, node)
          loadingKeys.delete(node.key)
        })
      }
    }
  }
}

function isExpanded(node: TreeNode): boolean {
  return expandedKeySet.value.has(node.key)
}

function collpase(node: TreeNode) {
  expandedKeySet.value.delete(node.key)
}
function expand(node: TreeNode) {
  expandedKeySet.value.add(node.key)
  triggerLoading(node)
}
function toggle(node: TreeNode) {
  const expandedKeys = expandedKeySet.value
  // 如果当前这个节点 正在加载中 不能收起
  if (expandedKeys.has(node.key) && !loadingKeysRef.value.has(node.key)) {
    collpase(node)
  }
  else {
    expand(node)
  }
}

const selectKeysRef = ref<Key[]>([])

watch(
  () => props.selectedKeys,
  (value) => {
    if (value) {
      selectKeysRef.value = value
    }
  },
  {
    immediate: true,
  },
)
// 处理选中的节点
function handleSelect(node: TreeNode) {
  let keys = Array.from(selectKeysRef.value)

  if (!props.selectable)
    return // 如果不能选择什么都不用做了

  if (props.multiple) {
    // 多选
    const index = keys.findIndex(key => key === node.key)
    if (index > -1) {
      keys.splice(index, 1) // 取消选中
    }
    else {
      keys.push(node.key)
    }
  }
  else {
    // 单选
    if (keys.includes(node.key)) {
      keys = [] // 取消单选
    }
    else {
      keys = [node.key] // 选中
    }
  }
  emit('update:selectedKeys', keys)
}

provide(treeInjectKey, {
  slot: useSlots(),
})

const checkedKeysRefs = ref(new Set(props.defaultCheckedKeys))
const indeterminateRefs = ref<Set<Key>>(new Set())

function isChecked(node: TreeNode) {
  return checkedKeysRefs.value.has(node.key)
}
function isDisabled(node: TreeNode) {
  return !!node.disabled
}
function isIndeterminate(node: TreeNode) {
  return indeterminateRefs.value.has(node.key)
}

function findNode(key: Key) {
  return flattenTree.value.find(node => node.key === key)
}

// 自上而下的选中
function recurUpdateCheckedFromParent(node: TreeNode, checked: boolean) {
  if (!node)
    return
  const checkedKeys = checkedKeysRefs.value

  if (checked) {
    // 选中的时候 去掉半选状态
    indeterminateRefs.value.delete(node.key)
  }
  // 维护当前的key列表
  checkedKeys[checked ? 'add' : 'delete'](node.key)

  const children = node.children
  if (children) {
    children.forEach((childNode) => {
      if (!childNode.disabled) {
        recurUpdateCheckedFromParent(childNode, checked)
      }
    })
  }
}

function recurUpdateCheckedFromChild(node: TreeNode) {
  if (!node)
    return

  // 自下而上的更新
  if (node.parentKey) {
    const parentNode = findNode(node.parentKey)

    if (parentNode) {
      let allChecked = true // 默认儿子们应该全部选中
      let hasChecked = false // 儿子们有没有全部被选中

      const nodes = parentNode.children
      for (const node of nodes) {
        if (checkedKeysRefs.value.has(node.key)) {
          hasChecked = true // 子节点被选中了
        }
        else if (indeterminateRefs.value.has(node.key)) {
          allChecked = false
          hasChecked = true
        }
        else {
          allChecked = false // 有一个儿子节点没有被选中
        }
      }
      if (allChecked) {
        // 如果儿子节点全部被选中
        checkedKeysRefs.value.add(parentNode.key) // 父节点全选标识生效
        indeterminateRefs.value.delete(parentNode.key) // 父节点半选标识移除
      }
      else if (hasChecked) {
        // 如果儿子节点有一个是没选中
        checkedKeysRefs.value.delete(parentNode.key) // 父节点全选标识移除
        indeterminateRefs.value.add(parentNode.key) // 父节点半选标识生效
      }
      recurUpdateCheckedFromChild(parentNode)
    }
  }
}

function toggleCheck(node: TreeNode, checked: boolean) {
  recurUpdateCheckedFromParent(node, checked)
  recurUpdateCheckedFromChild(node)
}

onMounted(() => {
  checkedKeysRefs.value.forEach((key) => {
    toggleCheck(findNode(key)!, true)
  })
})
</script>

<template>
  <div :class="bem.b()">
    <DewVirtualList :items="flattenTree" :remain="8" :size="31">
      <template #default="{ node }">
        <DewTreeNode
          :key="node.key"
          :node="node"
          :expanded="isExpanded(node)"
          :loading-keys="loadingKeysRef"
          :selected-keys="selectKeysRef"
          :show-checkbox="showCheckbox"
          :checked="isChecked(node)"
          :disabled="isDisabled(node)"
          :indeterminate="isIndeterminate(node)"
          @select="handleSelect"
          @toggle="toggle"
          @check="toggleCheck"
        />
      </template>
    </DewVirtualList>
  </div>
</template>
