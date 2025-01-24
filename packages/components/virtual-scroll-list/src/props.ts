import type { DefineComponent, ExtractPropTypes, PropType } from 'vue'

export const virtualProps = {
  dataSources: {
    type: Array,
    required: true,
    default: () => [],
  },
  dataKey: {
    type: String,
    required: true,
  },
  keeps: {
    type: Number,
    default: 30,
  },
  estimateSize: {
    type: Number,
    default: 80,
  },
  dataComponent: {
    type: [Object, Function] as PropType<DefineComponent<{}, {}, any>>,
    required: true,
  },
} as const

export interface RangeOptions {
  start: number
  end: number
  padFront: number
  padBehind: number
}

export interface VirtualOptions {
  keeps: number
  buffer: number
  estimateSize: number
  uniqueIds: string[]
}

export const virtualItemProps = {
  uniqueKey: {
    type: [String, Number] as PropType<string | number>,
  },
  source: {
    type: Object,
    required: true,
  },
  component: {
    type: [Object, Function] as PropType<DefineComponent<{}, {}, any>>,
  },
} as const

export type VirtualItemProps = ExtractPropTypes<typeof virtualItemProps>

export type updateType = (range: RangeOptions) => void

export type VirtualProps = ExtractPropTypes<typeof virtualProps>
