import { withInstall } from '@dew-ui/utils/with-Install'
import _Button from './src/button.vue'

const Button = withInstall(_Button)

export default Button

// 这里添加的类型 可以在模板中被解析
declare module 'vue' {
  export interface GlobalComponents {
    // 我们的接口可以自动合并
    DewButton: typeof Button
  }
}

export * from './src/button'
