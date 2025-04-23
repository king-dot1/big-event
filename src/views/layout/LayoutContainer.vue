<script setup>
import {
  Management,
  UserFilled,
  EditPen,
  Crop,
  User,
  List,
  CaretRight,
  CaretBottom,
  SwitchButton
} from '@element-plus/icons-vue'
import avatar from '@/assets/default.png'
import { ref, onMounted } from 'vue'
import { useUserStore } from '@/stores/index'
import { useRouter } from 'vue-router'

const userStore = useUserStore()
const router = useRouter()

// 点击头像下拉菜单的事件
const onCommand = async (command) => {
  // 如果等于 logout 执行退出；否则跳转到对应的路由
  if (command === 'logout') {
    await ElMessageBox.confirm('您确认要退出登录吗?', '温馨提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
    // 清除 token userInfo
    userStore.removeToken()
    userStore.removeUserInfo()
    router.push('/login')
  } else {
    router.push(`/user/${command}`)
  }
}

const isDropdown = ref(true) // 控制头像 右边的小图标方向
const visibleChange = (e) => {
  isDropdown.value = !e
}

// 挂载阶段调用
onMounted(() => {
  userStore.getUserInfo()
})
</script>
<template>
  <el-container class="layout-container">
    <!-- 左测边栏 -->
    <el-aside width="200px">
      <div class="el-aside-bg"></div>
      <el-menu
        active-text-color="#ffd04b"
        background-color="#232323"
        :default-active="$route.path"
        text-color="#fff"
        router
      >
        <el-menu-item index="/article/channel">
          <el-icon><List /></el-icon>
          <span>文章分类</span>
        </el-menu-item>
        <el-menu-item index="/article/manage">
          <el-icon><Management /></el-icon>
          <span>文章管理</span>
        </el-menu-item>
        <el-sub-menu index="/user">
          <template #title>
            <el-icon><UserFilled /></el-icon>
            <span>个人中心</span>
          </template>
          <el-menu-item index="/user/profile">
            <el-icon><User /></el-icon>
            <span>基础资料</span>
          </el-menu-item>
          <el-menu-item index="/user/avatar">
            <el-icon><Crop /></el-icon>
            <span>更换头像</span>
          </el-menu-item>
          <el-menu-item index="/user/password">
            <el-icon><EditPen /></el-icon>
            <span>重置密码</span>
          </el-menu-item>
        </el-sub-menu>
      </el-menu>
    </el-aside>
    <!-- 右侧内容 -->
    <el-container>
      <el-header>
        <div>
          用户名称：<strong>{{
            userStore.userInfo.nickname || userStore.userInfo.username
          }}</strong>
        </div>
        <el-dropdown @command="onCommand" @visible-change="visibleChange">
          <span class="el-dropdown-link">
            <el-avatar
              :size="40"
              :src="userStore.userInfo.user_pic || avatar"
            />
            <el-icon class="el-icon--right">
              <el-icon v-if="isDropdown"><CaretRight /></el-icon>
              <el-icon v-else><CaretBottom /></el-icon>
            </el-icon>
          </span>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item :icon="User" command="profile">
                基础资料
              </el-dropdown-item>
              <el-dropdown-item :icon="Crop" command="avatar">
                更换头像
              </el-dropdown-item>
              <el-dropdown-item :icon="EditPen" command="password">
                重置密码
              </el-dropdown-item>
              <el-dropdown-item :icon="SwitchButton" command="logout">
                退出登录
              </el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </el-header>
      <el-main>
        <router-view></router-view>
      </el-main>
      <el-footer
        >大事件 ©2025 Created by
        {{
          userStore.userInfo.nickname || userStore.userInfo.username
        }}</el-footer
      >
    </el-container>
  </el-container>
</template>

<style lang="scss" scoped>
.layout-container {
  height: 100vh;
  .el-aside {
    background-color: #232323;
  }
  .el-aside-bg {
    height: 120px;
    background: url('@/assets/logo.png') no-repeat center / 120px auto;
  }
  .el-header {
    background-color: #fff;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .el-dropdown-link {
      cursor: pointer;
      display: flex;
      align-items: center;
    }
    // 鼠标结果头像 去掉边框样式
    :focus-visible {
      outline: none;
    }
  }
  .el-footer {
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 14px;
    color: #666;
  }
}
</style>
