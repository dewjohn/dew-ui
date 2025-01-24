import DewIcon from '@dew-ui/components/icon'

import DefaultTheme from 'vitepress/theme'
import '@dew-ui/theme-chalk/src/index.scss'

export default {
  ...DefaultTheme,
  enhanceApp({ app }) {
    app.use(DewIcon) // 在vitepress中 注册全局组件
  },
}
