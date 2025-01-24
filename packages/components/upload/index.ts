import { withInstall } from '@dew-ui/utils/with-Install'
import _Upload from './src/upload.vue'

const Upload = withInstall(_Upload)

export default Upload

// 这里添加的类型 可以在模板中被解析
declare module 'vue' {
  export interface GlobalComponents {
    // 我们的接口可以自动合并
    DewUpload: typeof Upload
  }
}

export * from './src/upload'
