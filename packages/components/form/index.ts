import { withInstall } from '@dew-ui/utils/with-Install'
import _FormItem from './src/form-item.vue'
import _Form from './src/form.vue'

const FormItem = withInstall(_FormItem)
const Form = withInstall(_Form)

export { FormItem, Form }

export type FormInstance = InstanceType<typeof Form> 

// 这里添加的类型 可以在模板中被解析
declare module 'vue' {
  export interface GlobalComponents {
    // 我们的接口可以自动合并
    DewFormItem: typeof FormItem
    DewForm: typeof Form
  }
}

export * from './src/form-item'
export * from './src/form'
