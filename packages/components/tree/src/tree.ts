import { ExtractPropTypes, PropType } from 'vue'

export type Key = string | number

export interface TreeNode extends Required<TreeOption> {
  level: number
  rawNode: TreeOption
  children: TreeNode[]
  isLeaf: boolean
}

export interface TreeOption {
  label?: Key
  key?: Key
  children?: TreeOption[]
  isLeaf: boolean
  [key: string]: unknown // 任意的接口
}

// vue 组件的props
export const treeProps = {
  data: {
    type: Array as PropType<TreeOption[]>,
    default: () => []
  },
  defaultExpandedKeys: {
    type: Array as PropType<Array<Key>>,
    default: () => []
  },
  labelFiled: {
    type: String,
    default: 'label'
  },
  keyField: {
    type: String,
    default: 'key'
  },
  childrenField: {
    type: String,
    default: 'children'
  },
  onLoad: Function as PropType<(node: TreeOption) => Promise<TreeOption[]>>,
  selectedKeys: {
    type: Array as PropType<Key[]>
  },
  selectable: {
    type: Boolean,
    default: true
  },
  multiple: {
    type: Boolean,
    default: false
  }
} as const

export const treeNodeProps = {
  node: {
    type: Object as PropType<TreeNode>,
    required: true
  },
  expanded: {
    type: Boolean,
    required: true
  },
  loadingKeys: {
    type: Object as PropType<Set<Key>>
  },
  selectedKeys: {
    type: Array as PropType<Key[]>,
    default: []
  }
} as const

export const treeNodeEmits = {
  toggle: (node: TreeNode) => node,
  select: (node: TreeNode) => node
}

export const treeEmitts = {
  // 内部发射的事件用来同步响应式数据
  'update:selectedKeys': (keys: Key[]) => keys
}

export type TreeNodeProps = Partial<ExtractPropTypes<typeof treeNodeProps>>
export type TreeProps = Partial<ExtractPropTypes<typeof treeProps>>
