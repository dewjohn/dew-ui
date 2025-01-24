// 用来整合组件的 最终实现导出组件

import type { ExtractPropTypes, PropType } from 'vue'

export const iconProps = {
  color: String,
  size: [Number, String] as PropType<number | string>,
} as const

export type IconProps = ExtractPropTypes<typeof iconProps>
