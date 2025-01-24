import Button from '@dew-ui/components/button'
import Calendar from '@dew-ui/components/calendar'
import Checkbox from '@dew-ui/components/checkbox'

import { Form, FormItem } from '@dew-ui/components/form'

import Icon from '@dew-ui/components/icon'
import Input from '@dew-ui/components/input'
import Tree from '@dew-ui/components/tree'
import Upload from '@dew-ui/components/upload'
import VirtualScrollList from '@dew-ui/components/virtual-scroll-list'
import { createApp } from 'vue'
import App from './App.vue'
import './style.css'
import '@dew-ui/theme-chalk/src/index.scss'

const plugins = [
  Icon,
  Tree,
  Checkbox,
  Button,
  Input,
  FormItem,
  Form,
  Upload,
  Calendar,
  VirtualScrollList,
]

const app = createApp(App)
plugins.forEach(plugin => app.use(plugin)) // 将组件注册成全局注册，可以使用了
app.mount('#app')
