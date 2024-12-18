import { ExtractPropTypes, PropType } from 'vue'

export const checkboxProps = {
  modelValue: {
    type: [Boolean, String, Number] as PropType<boolean | number | string>
  },
  indeterminate: Boolean,
  disabled: Boolean,
  label: {
    type: String
  }
} as const

export type CheckboxProps = Partial<ExtractPropTypes<typeof checkboxProps>>

export const checkboxEmit = {
  'update:modelValue': (value: boolean | string | number) =>
    typeof value === 'boolean',
  change: (value: boolean) => typeof value === 'boolean'
}

export type CheckboxEmit = typeof checkboxEmit
