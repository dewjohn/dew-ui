import { withInstall } from '@dew-ui/utils/with-Install'
import _Virtual from './src/virtual'

const Virtual = withInstall(_Virtual)

export default Virtual

// 这里添加的类型 可以在模板中被解析
declare module 'vue' {
  export interface GlobalComponents {
    // 我们的接口可以自动合并
    DewVirtual: typeof Virtual
  }
}
