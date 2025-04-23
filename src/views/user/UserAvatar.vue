<script setup>
import { ref } from 'vue'
import defaultAvatar from '@/assets/avatar.jpg'
import { Upload, Plus } from '@element-plus/icons-vue'
import { useUserStore } from '@/stores'
import { userUpdateAvatarService } from '@/api/user'

const fileInput = ref(null)
const userStore = useUserStore()
// 上传头像按钮加载状态
const btnLoading = ref(false)

// 预览图片地址
const imageUrl = ref(userStore.userInfo.user_pic || '')
// 上传状态
const avatarState = ref(true)

// 图片状态改变
const handleChange = (uploadFile) => {
  // 将上传的文件转成图片预览的地址
  imageUrl.value = URL.createObjectURL(uploadFile.raw)
  avatarState.value = false
}

// 选择头像
const handleSelectAvatar = () => {
  if (fileInput.value) {
    fileInput.value.click()
  }
}

// 上传头像
const handleUploading = async () => {
  // 1. 根据 blob URL 获取 Blob 对象
  const response = await fetch(imageUrl.value)
  const blob = await response.blob()

  // 2. 创建 FileReader 实例
  const reader = new FileReader()
  // 3. 读取 Blob 对象
  reader.readAsDataURL(blob)
  // 4. 监听读取完成事件
  reader.onloadend = async () => {
    // 确保得到完整的data:image格式的Base64字符串
    const dataUrl = reader.result
    const base64 = 'data:image/jpeg;base64,' + dataUrl.split(',')[1]

    btnLoading.value = true
    // 这里可以继续处理 base64 编码的数据，例如发送到服务器
    await userUpdateAvatarService(base64)
    btnLoading.value = false
    avatarState.value = true
    // 更新 pinia 中的用户信息, 重新渲染数据
    userStore.getUserInfo()
    ElMessage({
      type: 'success',
      message: '更换头像成功'
    })
  }
}
</script>

<template>
  <page-container class="user-avatar" title="更新头像">
    <el-row>
      <el-col :span="12">
        <el-upload
          class="avatar-uploader"
          :show-file-list="false"
          :auto-upload="false"
          :on-change="handleChange"
        >
          <img v-if="imageUrl" :src="imageUrl" class="avatar" />
          <img
            v-else
            :src="defaultAvatar"
            alt=""
            width="278px"
            height="278px"
          />
          <!-- 这里隐藏原生的选择文件 input 元素 -->
          <input type="text" ref="fileInput" style="display: none" />
        </el-upload>
        <br />
        <el-button
          @click.stop="handleSelectAvatar"
          size="large"
          type="primary"
          :icon="Plus"
        >
          选择图片
        </el-button>
        <el-button
          size="large"
          :disabled="avatarState"
          type="success"
          :icon="Upload"
          :loading="btnLoading"
          @click="handleUploading"
        >
          上传头像
        </el-button>
      </el-col>
    </el-row>
  </page-container>
</template>

<style lang="scss" scoped>
.user-avatar {
  .avatar-uploader {
    :deep() {
      .avatar {
        width: 278px;
        height: 278px;
        display: block;
      }
      .el-upload {
        border: 1px dashed var(--el-border-color);
        border-radius: 6px;
        cursor: pointer;
        position: relative;
        overflow: hidden;
        transition: var(--el-transition-duration-fast);
      }
      .el-upload:hover {
        border-color: var(--el-color-primary);
      }
      .el-icon.avatar-uploader-icon {
        font-size: 28px;
        color: #8c939d;
        width: 278px;
        height: 278px;
        text-align: center;
      }
    }
  }
}
</style>
