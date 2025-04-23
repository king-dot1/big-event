<script setup>
import { User, Lock } from '@element-plus/icons-vue'
import { ref, watch } from 'vue'
import { userRegisterService } from '@/api/user'
import { userLoginService } from '@/api/user'
import { useUserStore } from '@/stores/index'
import { useRouter } from 'vue-router'

const isLogin = ref(true)
// 表单数据
const formModel = ref({
  username: '',
  password: '',
  repassword: ''
})
// 表单校验规则
const rules = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 5, max: 10, message: '用户名必须是5-10位的字符', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    {
      pattern: /^\S{6,15}$/,
      message: '密码必须是6-15位的非空字符',
      trigger: 'blur'
    }
  ],
  repassword: [
    { required: true, message: '请再次输入密码', trigger: 'blur' },
    {
      pattern: /^\S{6,15}$/,
      message: '密码必须是6-15位的非空字符',
      trigger: 'blur'
    },
    {
      validator: (rule, value, callback) => {
        if (value !== formModel.value.password) {
          callback(new Error('两次密码不一致'))
        } else {
          callback()
        }
      },
      trigger: 'blur'
    }
  ]
}
const formRef = ref()

// 注册
const register = async () => {
  // 表单校验
  await formRef.value.validate()
  // 调用注册接口
  await userRegisterService(formModel.value).then((res) => {
    ElMessage({
      message: res.data.message,
      type: 'success'
    })
    isLogin.value = true
  })
}

// 登录
const userStore = useUserStore()
const router = useRouter()

const login = async () => {
  const res = await userLoginService(formModel.value)
  userStore.setToken(res.data.token)
  ElMessage({
    message: res.data.message,
    type: 'success'
  })
  router.push('/')
}

// 切换时清空表单数据
watch(isLogin, () => {
  formModel.value = {
    username: '',
    password: '',
    repassword: ''
  }
})
</script>
<template>
  <el-row class="login-page">
    <el-col :span="12" class="bg"></el-col>
    <el-col :span="6" :offset="3" class="form">
      <!-- 登录 form -->
      <el-form v-if="isLogin" :rules="rules" :model="formModel" ref="formRef">
        <el-form-item>
          <h1>登录</h1>
        </el-form-item>
        <el-form-item prop="username">
          <el-input
            v-model="formModel.username"
            placeholder="请输入用户名"
            :prefix-icon="User"
            size="large"
          ></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            v-model="formModel.password"
            placeholder="请输入密码"
            :prefix-icon="Lock"
            size="large"
            type="password"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <div class="flex">
            <el-checkbox label="记住我" size="large" />
            <el-link type="primary" :underline="false">忘记密码？</el-link>
          </div>
        </el-form-item>
        <el-form-item>
          <el-button
            class="button"
            type="primary"
            auto-insert-space
            size="large"
            @click="login"
            >登录</el-button
          >
        </el-form-item>
        <el-form-item>
          <el-link type="info" :underline="false" @click="isLogin = false">
            注册 →
          </el-link>
        </el-form-item>
      </el-form>
      <!-- 注册 form -->
      <el-form v-else :rules="rules" :model="formModel" ref="formRef">
        <el-form-item>
          <h1>注册</h1>
        </el-form-item>
        <el-form-item prop="username">
          <el-input
            v-model="formModel.username"
            placeholder="请输入用户名"
            :prefix-icon="User"
            size="large"
          ></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            v-model="formModel.password"
            placeholder="请输入密码"
            :prefix-icon="Lock"
            size="large"
            type="password"
          ></el-input>
        </el-form-item>
        <el-form-item prop="repassword">
          <el-input
            v-model="formModel.repassword"
            placeholder="请输入再次密码"
            :prefix-icon="Lock"
            size="large"
            type="password"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button
            class="button"
            type="primary"
            auto-insert-space
            size="large"
            @click="register"
            >注册</el-button
          >
        </el-form-item>
        <el-form-item>
          <el-link type="info" :underline="false" @click="isLogin = true">
            ← 返回
          </el-link>
        </el-form-item>
      </el-form>
    </el-col>
  </el-row>
</template>

<style lang="scss" scoped>
.login-page {
  height: 100vh;
  background: #fff;
  .bg {
    // url('@/assets/logo2.png') no-repeat 60% center / 240px auto,
    // 背景图像 url('@/assets/logo2.png')
    // 重复方式 no-repeat 不重复
    // 位置 60% center 水平方向距离元素 60%，垂直居中
    // / 尺寸 240px auto 宽度 240px，高度自适应
    background:
      url('@/assets/logo2.png') no-repeat 60% center/ 240px auto,
      url('@/assets/login_bg.jpg') no-repeat center / cover;
    border-radius: 0 20px 20px 0;
  }
  .form {
    display: flex;
    flex-direction: column;
    justify-content: center;
    user-select: none; // 禁止鼠标拖动选中文本
    .flex {
      width: 100%;
      display: flex;
      justify-content: space-between;
    }
    .button {
      width: 100%;
    }
  }
}
</style>
