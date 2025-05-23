import type { ExtractPropTypes, InjectionKey, PropType } from 'vue'
import type { Arrayable, FormItemContext, FormItemRule } from './form-item'

export const formProps = {
  model: Object,
  rules: {
    type: Object as PropType<Record<string, Arrayable<FormItemRule>>>,
  },
  showMessage: {
    type: Boolean,
    default: true,
  },
} as const

export type FormProps = Partial<ExtractPropTypes<typeof formProps>>

export interface FormContext extends FormProps {
  addField: (field: FormItemContext) => void
}

export const FormContextKey: InjectionKey<FormContext> = Symbol('form')
