import { withInstall } from '@dew-ui/utils/with-Install'
import _Checkbox from './src/checkbox.vue'

const Checkbox = withInstall(_Checkbox)

export default Checkbox

// 这里添加的类型 可以在模板中被解析
declare module 'vue' {
  export interface GlobalComponents {
    // 我们的接口可以自动合并
    DewCheckbox: typeof Checkbox
  }
}

export * from './src/checkbox'