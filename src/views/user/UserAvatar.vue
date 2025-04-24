<script setup>
import { ref } from 'vue'
import defaultAvatar from '@/assets/avatar.jpg'
import { Upload, Plus } from '@element-plus/icons-vue'
import { useUserStore } from '@/stores'
import { userUpdateAvatarService } from '@/api/user'
import { compressImage } from '@/utils/uploadCanvasImage'

const fileInput = ref(null)
const userStore = useUserStore()
// 上传头像按钮加载状态
const btnLoading = ref(false)

// 预览图片地址
const imageUrl = ref(userStore.userInfo.user_pic || '')
// 上传按钮禁用 -状态
const avatarState = ref(true)

// 图片状态改变
const handleChange = async (uploadFile) => {
  // 没有压缩的方式
  // const reader = new FileReader()
  // reader.readAsDataURL(uploadFile.raw)
  // reader.onloadend = () => {
  //   // 将 base64 编码的数据赋值给 imageUrl
  //   imageUrl.value = reader.result
  // }

  try {
    let scale = 1
    if (uploadFile.raw.size < 1024 * 1024) {
      //小于1M
      scale = 0.8
    } else if (uploadFile.raw.size < 3 * 1024 * 1024) {
      //小于3M
      scale = 0.3
    } else if (uploadFile.raw.size < 5 * 1024 * 1024) {
      //小于5M
      scale = 0.2
    } else {
      //大于5M
      scale = 0.1
    }
    // 压缩图片，并返回压缩后的 Blob 对象
    const compressedBlob = await compressImage(uploadFile.raw, 800, 600, scale)
    // 将压缩后的 Blob 对象转换为 base64 编码
    const reader = new FileReader()
    reader.readAsDataURL(compressedBlob)
    reader.onloadend = () => {
      // 将 base64 编码的数据赋值给 imageUrl
      imageUrl.value = reader.result
    }
  } catch (error) {
    console.log('选择图片失败', error)

    ElMessage({
      type: 'success',
      message: '选择图片失败，请重新上传！'
    })
  }

  // 将上传的文件转成图片预览的地址
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
  btnLoading.value = true
  try {
    // 这里可以继续处理 base64 编码的数据，例如发送到服务器
    await userUpdateAvatarService(imageUrl.value)
    // 更新 pinia 中的用户信息, 重新渲染数据
    await userStore.getUserInfo()

    ElMessage({
      type: 'success',
      message: '更换头像成功'
    })
  } catch (error) {
    console.log('上传头像请求失败', error)
    ElMessage({
      type: 'error',
      message: '上传头像失败,请重新上传！'
    })
  }
  avatarState.value = true
  btnLoading.value = false
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
