<script setup>
import { ref } from 'vue'
import { useUserStore } from '@/stores/index'
import { userUserinfoService } from '@/api/user'

// 从 pinia 中获取用户信息
const userStore = useUserStore()

const formModel = ref({ ...userStore.userInfo })
const rules = {
  nickname: [
    { required: true, message: '请输入用户昵称', trigger: 'blur' },
    {
      pattern: /^\S{2,10}$/,
      message: '请输入2-10位的非空字符昵称',
      trigger: 'blur'
    }
  ],
  email: [
    { required: true, message: '请输入用户邮箱', trigger: 'blur' },
    { type: 'email', message: '请输入正确的邮箱格式', trigger: 'blur' }
  ]
}

// 按钮加载状态
const btnLoading = ref(false)

// 提交表单
const handleSubmit = async () => {
  // 调用接口更新用户信息
  try {
    btnLoading.value = true
    await userUserinfoService(formModel.value)
    btnLoading.value = false
    ElMessage({
      type: 'success',
      message: '修改成功'
    })
  } catch (error) {
    console.error(error)
  }
  // 更新 pinia 中的用户信息, 重新渲染数据
  userStore.getUserInfo()
}
</script>

<template>
  <!-- 使用组件框架 -->
  <page-container class="user-profile" title="基本质料">
    <!-- 使用默认插件 -->
    <el-row>
      <el-col :span="12">
        <el-form
          :model="formModel"
          :rules="rules"
          label-width="100px"
          size="large"
        >
          <el-form-item label="登录名称">
            <el-input v-model="formModel.username" :disabled="true"></el-input>
          </el-form-item>
          <el-form-item label="用户昵称" prop="nickname">
            <el-input
              v-model="formModel.nickname"
              placeholder="请输入用户昵称"
            ></el-input>
          </el-form-item>
          <el-form-item label="用户邮箱" prop="email">
            <el-input
              v-model="formModel.email"
              placeholder="请输入用户邮箱"
            ></el-input>
          </el-form-item>
          <el-form-item>
            <el-button
              @click="handleSubmit"
              :loading="btnLoading"
              type="primary"
              >提交修改</el-button
            >
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
  </page-container>
</template>

<style lang="scss" scoped></style>
