import type { ExtractPropTypes, PropType } from 'vue'
import type { Key, TreeNode } from './tree'

export const treeNodeProps = {
  node: {
    type: Object as PropType<TreeNode>,
    required: true,
  },
  expanded: {
    type: Boolean,
    required: true,
  },
  loadingKeys: {
    type: Object as PropType<Set<Key>>,
  },
  selectedKeys: {
    type: Array as PropType<Key[]>,
    default: [],
  },
  showCheckbox: {
    type: Boolean,
    default: false,
  },
  checked: Boolean,
  disabled: Boolean,
  indeterminate: Boolean,
} as const

export const treeNodeEmits = {
  toggle: (node: TreeNode) => node,
  select: (node: TreeNode) => node,
  check: (node: TreeNode, value: boolean) => typeof value === 'boolean',
}

export type TreeNodeProps = Partial<ExtractPropTypes<typeof treeNodeProps>>
