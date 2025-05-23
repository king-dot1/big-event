// 仓库统一管理
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'

const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)

export default pinia

// 按需导出
// import { useUserStore } from './modules/user'
// export { useUserStore }
export * from './modules/user'
