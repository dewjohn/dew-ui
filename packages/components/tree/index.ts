import { withInstall } from '@dew-ui/utils/with-Install'
import _Tree from './src/tree.vue'

const Tree = withInstall(_Tree)

export default Tree

// 这里添加的类型 可以在模板中被解析
declare module 'vue' {
  export interface GlobalComponents {
    // 我们的接口可以自动合并
    DewTree: typeof Tree
  }
}

export * from './src/tree'
