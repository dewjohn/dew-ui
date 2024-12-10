<template>
  <div :class="bem.b()">
    <dew-tree-node
      v-for="node in flattenTree"
      :node="node"
      :expanded="isExpanded(node)"
      :loadingKeys="loadingKeysRef"
      @toggle="toggle"
      :key="node.key"
    ></dew-tree-node>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { Key, TreeNode, TreeOption, treeProps } from './tree'
import { watch } from 'vue'
import { createNameSpace } from '@dew-ui/utils/create'
import DewTreeNode from './treeNode.vue'

defineOptions({
  name: 'dew-tree'
})

const bem = createNameSpace('tree')

const props = defineProps(treeProps)
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
    }
  }
}

const treeOptions = createOption(
  props.keyField,
  props.labelFiled,
  props.childrenField
)
function createTree(data: TreeOption[], parent: TreeNode | null = null) {
  function traversal(data: TreeOption[], parent: TreeNode | null = null) {
    return data.map(node => {
      let children = treeOptions.getChildren(node) || []
      const treeNode: TreeNode = {
        key: treeOptions.getKey(node),
        label: treeOptions.getLabel(node),
        children: [],
        rawNode: node,
        level: parent ? parent.level + 1 : 0,
        isLeaf: node.isLeaf ?? children.length === 0
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
    console.log(tree.value)
  },
  { immediate: true }
)

// 需要展开的key有哪些
const expandedKeySet = ref(new Set(props.defaultExpandedKeys))

const flattenTree = computed(() => {
  let expandedKeys = expandedKeySet.value // 要展开的keys有哪些
  let flattenNodes: TreeNode[] = [] // 拍平之后的结果
  const nodes = tree.value || [] // 被格式化的节点
  const stack: TreeNode[] = [] // 用于被遍历的栈
  for (let i = nodes.length - 1; i >= 0; i--) {
    // 倒序放入
    stack.push(nodes[i])
  }
  // 深度遍历
  while (stack.length) {
    const node = stack.pop()
    if (!node) continue
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
        onLoad!(node.rawNode).then(children => {
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
  } else {
    expand(node)
  }
}
</script>
