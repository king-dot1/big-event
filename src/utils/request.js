// 创建一个axios实例
import axios from 'axios'
import { useUserStore } from '@/stores/index'
import router from '@/router'
import { ElMessage } from 'element-plus'

const baseURL = 'https://big-event-vue-api-t.itheima.net'
const instance = axios.create({
  baseURL, // 请求的基础地址
  timeout: 10000 // 请求超时时间
})

// 添加请求拦截器
instance.interceptors.request.use(
  (config) => {
    // 携带token
    const userStore = useUserStore()
    if (userStore.token) {
      config.headers.Authorization = userStore.token
    }
    return config
  },
  (error) => {
    // 对请求错误做些什么
    return Promise.reject(error)
  }
)

// 添加响应拦截器
instance.interceptors.response.use(
  (response) => {
    // 成功直接返回
    if (response.data.code === 0) {
      return response
    }
    // 失败提示
    ElMessage({
      message: response.data.message || '服务异常',
      type: 'error'
    })
    return Promise.reject(response.data)
  },
  (error) => {
    // 对响应错误做点什么
    // 错误 401 => token 过期 或 权限不足
    if (error.response?.status === 401) {
      router.push('/login')
    }

    // 失败默认提示
    ElMessage({
      message: error.response.data.message || '服务异常',
      type: 'error'
    })
    return Promise.reject(error)
  }
)

export default instance
export { baseURL }
