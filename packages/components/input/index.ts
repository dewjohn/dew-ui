import { withInstall } from '@dew-ui/utils/with-Install'
import _Input from './src/input.vue'

const Input = withInstall(_Input)

export default Input

// 这里添加的类型 可以在模板中被解析
declare module 'vue' {
  export interface GlobalComponents {
    // 我们的接口可以自动合并
    DewInput: typeof Input
  }
}

export * from './src/input'
