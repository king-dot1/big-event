<script setup>
import { ref } from 'vue'
import { userUpdatePwdService } from '@/api/user'
import { useUserStore } from '@/stores'
import { useRouter } from 'vue-router'

const formModel = ref({
  old_pwd: '', // 旧密码 6-15位非空格字符
  new_pwd: '', // 新密码 6-15位非空格字符
  re_pwd: '' // 确认新密码
})
const formRef = ref()
// 按钮加载状态
const btnLoading = ref(false)

const rules = {
  old_pwd: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    {
      pattern: /^\S{6,15}$/,
      message: '请输入长度为6-15位字符的密码',
      trigger: 'blur'
    }
  ],
  new_pwd: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    {
      pattern: /^\S{6,15}$/,
      message: '请输入长度为6-15位字符的密码',
      trigger: 'blur'
    },
    {
      validator: (rule, value, callback) => {
        if (value === formModel.value.old_pwd) {
          callback(new Error('新密码不能与旧密码相同'))
        } else {
          callback()
        }
      },
      trigger: 'blur'
    }
  ],
  re_pwd: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    {
      pattern: /^\S{6,15}$/,
      message: '请输入长度为6-15位字符的密码',
      trigger: 'blur'
    },
    {
      validator: (rule, value, callback) => {
        if (value !== formModel.value.new_pwd) {
          callback(new Error('两次密码不一致'))
        } else {
          callback()
        }
      },
      trigger: 'blur'
    }
  ]
}

const userStore = useUserStore()
const router = useRouter()
// 修改密码
const handleSubmit = async () => {
  // 登录校验
  await formRef.value.validate()
  btnLoading.value = true
  try {
    await userUpdatePwdService(formModel.value)
    ElMessage({
      type: 'success',
      message: '更换密码成功'
    })

    btnLoading.value = false
    // 退出登录、清除 token、用户信息
    userStore.removeToken()
    userStore.removeUserInfo()
    // 跳转到登录页
    router.push('/login')
  } catch (error) {
    console.error(error)
    btnLoading.value = false
  }
}

// 重置表单
const handleReset = () => {
  // 重置校验状态
  formRef.value.resetFields()
}
</script>

<template>
  <page-container title="重置密码" class="user-password">
    <el-row>
      <el-col :span="12">
        <el-form
          :model="formModel"
          :rules="rules"
          label-width="100px"
          size="large"
          ref="formRef"
        >
          <el-form-item label="原密码" prop="old_pwd">
            <el-input v-model="formModel.old_pwd" type="password"></el-input>
          </el-form-item>
          <el-form-item label="新密码" prop="new_pwd">
            <el-input v-model="formModel.new_pwd" type="password"></el-input>
          </el-form-item>
          <el-form-item label="确认新密码" prop="re_pwd">
            <el-input v-model="formModel.re_pwd" type="password"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button
              type="primary"
              @click="handleSubmit"
              :loading="btnLoading"
              >修改密码</el-button
            >
            <el-button @click="handleReset">重置</el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
  </page-container>
</template>
