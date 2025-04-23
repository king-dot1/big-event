import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import '@/assets/main.scss'
import pinia from '@/stores/index'
import ElementPlus from 'element-plus'
import zhCn from 'element-plus/dist/locale/zh-cn.mjs'

const app = createApp(App)

app.use(ElementPlus, {
  locale: zhCn
})
app.use(pinia)
app.use(router)

app.mount('#app')
