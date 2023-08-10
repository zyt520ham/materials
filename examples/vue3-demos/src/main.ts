/*
 * @Description:
 * @Author: Gavin
 * @Date: 2023-08-10 16:43:38
 * @LastEditors: Gavin
 * @LastEditTime: 2023-08-10 16:43:48
 * @FilePath: /soybean-materials/examples/vue3-demos/src/main.ts
 */
import { createApp } from 'vue';
import 'uno.css';
import '@soybeanjs/vue-materials/dist/style.css';
import './styles/global.css';

import App from './App.vue';

const app = createApp(App);

app.mount('#app');
