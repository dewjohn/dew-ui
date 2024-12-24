import { createApp } from 'vue'
import './style.css'
import App from './App.vue'

import '@dew-ui/theme-chalk/src/index.scss'

import Icon from '@dew-ui/components/icon'
import Tree from '@dew-ui/components/tree'
import Checkbox from '@dew-ui/components/checkbox'
import Button from '@dew-ui/components/button'

const plugins = [Icon, Tree, Checkbox, Button]

const app = createApp(App)
plugins.forEach(plugin => app.use(plugin)) // 将组件注册成全局注册，可以使用了
app.mount('#app')
