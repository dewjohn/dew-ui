import type { ExtractPropTypes, PropType } from 'vue'

export type Size = 'small' | 'medium' | 'large'

export type Type =
  | 'primary'
  | 'success'
  | 'warning'
  | 'danger'
  | 'info'
  | 'default'
  | ''

export type NativeType = 'button' | 'submit' | 'reset'

export type Placement = 'left' | 'right'

export const buttonProps = {
  size: String as PropType<Size>,
  type: {
    type: String as PropType<Type>,
    validator: (val: string) => {
      return [
        'primary',
        'success',
        'warning',
        'danger',
        'info',
        'default',
      ].includes(val)
    },
    default: '',
  },
  round: Boolean,
  loading: Boolean,
  disabled: Boolean,
  nativeType: {
    type: String as PropType<NativeType>,
    default: 'button',
  },
  iconPlacement: {
    type: String as PropType<Placement>,
    default: 'left',
  },
} as const

export const buttonEmit = {
  click: (e: MouseEvent) => e instanceof MouseEvent,
  mousedown: (e: MouseEvent) => e instanceof MouseEvent,
}

export type ButtonProps = ExtractPropTypes<typeof buttonProps>
export type ButtonEmit = typeof buttonEmit
