import { defineStore } from 'pinia'
import { ref } from 'vue'
import { userInfoService } from '@/api/user'

// 用户模块 token setToken removeToken
export const useUserStore = defineStore(
  'user',
  () => {
    const token = ref('')
    const setToken = (newToken) => {
      token.value = newToken
    }
    const removeToken = () => {
      token.value = ''
    }

    // 用户信息
    const userInfo = ref({})
    // 获取用户信息
    const getUserInfo = async () => {
      const res = await userInfoService()
      userInfo.value = res.data.data
    }
    const removeUserInfo = () => {
      userInfo.value = ''
    }
    return {
      token,
      setToken,
      removeToken,
      userInfo,
      removeUserInfo,
      getUserInfo
    }
  },
  {
    persist: true
  }
)
