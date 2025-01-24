import type { ExtractPropTypes, PropType } from 'vue'

export const calendarProps = {
  // v-model === modelValue + update:modelValue
  modelValue: {
    type: Date,
  },
  range: {
    type: Array as any as PropType<[Date, Date]>,
  },
} as const // 属性都是只读的

export type CalendarProps = ExtractPropTypes<typeof calendarProps>

export const calendarEmits = {
  'update:modelValue': (val: Date) => val instanceof Date,
}

export type CalendarEmits = typeof calendarEmits

export type CalendarDateCellType = 'prev' | 'current' | 'next'

export interface CalendarDateCell {
  text: number
  type: CalendarDateCellType
}

export type CalendarDateType =
  | 'prev-month'
  | 'next-month'
  | 'prev-year'
  | 'next-year'
  | 'today'
