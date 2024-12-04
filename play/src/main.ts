import { createApp } from 'vue';
import './style.css';
import App from './App.vue';

import Icon from '@dew-ui/components/icon';

const plugins = [Icon];

const app = createApp(App);
plugins.forEach((plugin) => app.use(plugin)); // 将组件注册成全局注册，可以使用了
app.mount('#app');
