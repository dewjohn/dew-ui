<template>sadas</template>

<script setup lang="ts">
import { ref } from 'vue'
import { TreeNode, TreeOption, treeProps } from './tree'
import { watch } from 'vue'

defineOptions({
  name: 'dew-tree'
})

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
function createTree(data: TreeOption[]) {
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
        treeNode.children = traversal(children)
      }

      return treeNode
    })
  }
  const result: TreeNode[] = traversal(data)
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
</script>
