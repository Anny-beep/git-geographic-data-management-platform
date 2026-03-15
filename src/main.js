import { createApp } from 'vue'
import { createPinia } from 'pinia'
import './style.css'
// 只导入Bootstrap CSS，JS按需加载
import 'bootstrap/dist/css/bootstrap.min.css'
import App from './App.vue'

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.mount('#app')