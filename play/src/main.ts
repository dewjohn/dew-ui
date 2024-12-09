import { createApp } from 'vue'
import './style.css'
import App from './App.vue'

import Icon from '@dew-ui/components/icon'
import '@dew-ui/theme-chalk/src/index.scss'

import Tree from '@dew-ui/components/tree'

const plugins = [Icon, Tree]

const app = createApp(App)
plugins.forEach(plugin => app.use(plugin)) // 将组件注册成全局注册，可以使用了
app.mount('#app')
