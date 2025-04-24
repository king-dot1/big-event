import { createRouter, createWebHashHistory } from 'vue-router'
import { useUserStore } from '@/stores/index'

// createRouter 创建路由实例
// history模式： createWebHistory()
// hash模式：createWebHashHistory()
// import.meta.env.BASE_URL是路由的基础路径；默认 '/'
const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      component: () => import('@/views/login/LoginPage.vue')
    },
    {
      path: '/',
      component: () => import('@/views/layout/LayoutContainer.vue'),
      redirect: '/article/manage',
      children: [
        {
          path: '/article/manage',
          component: () => import('@/views/article/ArticleManage.vue')
        },
        {
          path: '/article/channel',
          component: () => import('@/views/article/ArticleChannel.vue')
        },
        {
          path: '/user/profile',
          component: () => import('@/views/user/UserProfile.vue')
        },
        {
          path: '/user/avatar',
          component: () => import('@/views/user/UserAvatar.vue')
        },
        {
          path: '/user/password',
          component: () => import('@/views/user/UserPassword.vue')
        }
      ]
    }
  ]
})

// 全局前置守卫
router.beforeEach((to) => {
  const userStore = useUserStore()
  // 如果没有 token 并且访问的不是登录页，跳转到登录页
  if (!userStore.token && to.path !== '/login') return '/login'
  return true
})

export default router
