// 导出ts的类型声明
import { withInstall } from '@dew-ui/utils/with-Install'
import _VirtualScrollList from './src/virtual-list'

const VirtualScrollList = withInstall(_VirtualScrollList)

export default VirtualScrollList

// 这里添加的类型 可以在模板中被解析
declare module 'vue' {
  export interface GlobalComponents {
    // 我们的接口可以自动合并
    DewVirtualScrollList: typeof VirtualScrollList
  }
}

export type { VirtualProps } from './src/props'
