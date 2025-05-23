<script setup>
import { ref } from 'vue'
import channelSelect from './channelSelect.vue'
import { Plus } from '@element-plus/icons-vue'
import { QuillEditor } from '@vueup/vue-quill'
import '@vueup/vue-quill/dist/vue-quill.snow.css'
import {
  ArticlePublishService,
  ArticleInfoService,
  ArticleUpdateService
} from '@/api/article'
import { baseURL } from '@/utils/request'
import axios from 'axios'
import { formatDate } from '@/utils/format'

const drawer = ref(false) // 控制抽屉的显示与隐藏
const defaultForm = {
  title: '', // 文章标题 (1-30个任意字符)
  cate_id: '', // 文章分类id
  content: '', // 文章内容
  cover_img: '', // 文章封面
  state: '' // 文章状态
}

const formRef = ref()
// 表单数据
const formModel = ref({ ...defaultForm })
// 图片预览
const imageUrl = ref('') // 图片预览的地址
const publishLoad = ref(false) // 发布按钮的loading
const draftLoad = ref(false) // 草稿按钮的loading
const preview = ref(false) // 是否是预览 默认不是 渲染
const previewLoad = ref(false) // 预览的loading

// 图片状态改变
const handleChange = (uploadFile) => {
  imageUrl.value = URL.createObjectURL(uploadFile.raw)
  formModel.value.cover_img = uploadFile.raw
}

// 校验规则
const rules = {
  title: [
    { required: true, message: '请输入文章标题', trigger: 'blur' },
    {
      pattern: /^.{1,30}$/,
      message: '文章标题长度在1-30个字符之间',
      trigger: 'blur'
    }
  ],
  cate_id: [{ required: true, message: '请选择文章分类', trigger: 'blur' }],
  content: [
    { required: true, message: '请输入文章内容', trigger: 'blur' },
    {
      validator: (rule, value, callback) => {
        const plainText = value.replace(/<[^>]*>/g, '').trim()
        if (!plainText) {
          callback(new Error('请输入文章内容'))
        } else {
          callback()
        }
      },
      trigger: 'blur'
    }
  ],
  cover_img: [{ required: true, message: '请上传文章封面', trigger: 'blur' }]
}

const validateContent = () => {
  formRef.value?.validateField('content')
}

const emit = defineEmits(['success'])

// 提交发布
const handleSubmit = async (state) => {
  formModel.value.state = state

  // 校验表单
  await formRef.value.validate()

  // 转成 form-data 数据
  const formData = new FormData()
  for (const key in formModel.value) {
    formData.append(key, formModel.value[key])
  }
  state === '已发布' ? (publishLoad.value = true) : (draftLoad.value = true)
  // 发起请求
  if (formModel.value.id) {
    // 更新
    await ArticleUpdateService(formData)
    publishLoad.value = false
    draftLoad.value = false

    ElMessage({
      message: '更新文章成功',
      type: 'success'
    })

    emit('success', 'edit')
  } else {
    // 添加
    await ArticlePublishService(formData)
    publishLoad.value = false
    draftLoad.value = false

    ElMessage({
      message: '添加文章成功',
      type: 'success'
    })

    // 成功给父组件发送事件，让父组件重新请求数据
    emit('success', 'add')
  }

  drawer.value = false
}

const editorRef = ref(null)

let title = ref('')
// 判断是编辑还是发布
const open = async (row, t) => {
  // 重置表单数据
  formModel.value = { ...defaultForm }
  imageUrl.value = ''
  // 标题
  title.value = t
  drawer.value = true
  // 重置表单校验
  formRef.value?.clearValidate()
  preview.value = t === '预览文章'
  if (row?.id) {
    // 编辑/预览
    // 开启预览的 loading
    previewLoad.value = true

    const res = await ArticleInfoService(row.id)
    formModel.value = res.data.data
    // 将文件字符串转为文件对象
    imageUrl.value = baseURL + formModel.value.cover_img
    // 关闭预览的 loading
    previewLoad.value = false

    // 调用方法
    formModel.value.cover_img = await urlToFile(
      imageUrl.value,
      formModel.value.cover_img
    )
  } else {
    // 发布 -重置表单
    imageUrl.value = ''
    formModel.value = { ...defaultForm }
    editorRef.value?.setHTML('')
  }
}

// 将网络图片地址转为file对象
const urlToFile = async (url, fileName) => {
  try {
    // 使用axios发送请求，配置 responseType 为 'arraybuffer'，以二进制数组形式接收响应数据
    const response = await axios.get(url, { responseType: 'arraybuffer' })
    // 从响应头中获取 Content-Type 信息，用于创建 Blob 对象
    const contentType = response.headers['content-type']
    // 创建 Blod 对象，将响应数据和 Content-Type 传入
    const blob = new Blob([response.data], { type: contentType })
    // 创建 File 对象，将 Blob 对象作为第一个参数，文件名作为第二个参数
    const file = new File([blob], fileName, { type: contentType })
    return file
  } catch (error) {
    // 若请求过程中出现错误，打印错误信息
    console.error('将图片转换为File对象时发生错误:', error)
    // 返回 null 表示转换失败
    return null
  }
}

// 暴露方法
defineExpose({
  open
})
</script>

<template>
  <!-- "formModel.cate_id ? '编辑文章' : '发布文章'" -->
  <el-drawer
    class="manage-drawer"
    v-model="drawer"
    :title="title"
    direction="rtl"
    size="50%"
  >
    <el-form
      ref="formRef"
      label-width="100px"
      :rules="rules"
      :model="formModel"
      v-if="!preview"
    >
      <el-form-item label="文章标题" prop="title">
        <el-input
          v-model="formModel.title"
          placeholder="请输入文章标题"
        ></el-input>
      </el-form-item>
      <el-form-item label="文章分类" prop="cate_id">
        <channelSelect v-model="formModel.cate_id"></channelSelect>
      </el-form-item>
      <el-form-item label="文章封面" prop="cover_img">
        <el-upload
          class="avatar-uploader"
          :show-file-list="false"
          :auto-upload="false"
          :on-change="handleChange"
        >
          <img v-if="imageUrl" :src="imageUrl" class="avatar" />
          <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
        </el-upload>
      </el-form-item>
      <el-form-item label="文章内容" prop="content">
        <div class="editor">
          <quill-editor
            ref="editorRef"
            v-model:content="formModel.content"
            placeholder="请输入文章内容..."
            content-type="html"
            theme="snow"
            @blur="validateContent"
          ></quill-editor>
        </div>
      </el-form-item>
      <el-form-item>
        <el-button
          :loading="publishLoad"
          type="primary"
          @click="handleSubmit('已发布')"
          >发布</el-button
        >
        <el-button :loading="draftLoad" @click="handleSubmit('草稿')"
          >草稿</el-button
        >
      </el-form-item>
    </el-form>
    <!-- 预览 -->
    <div v-loading="previewLoad" v-else>
      <h1>{{ formModel.title }}</h1>
      <div>
        <span class="padding-r-10"
          >作者: {{ formModel.nickname || formModel.username }}
        </span>
        <span class="padding-r-10"
          >时间: {{ formatDate(formModel.pub_date) }}
        </span>
        <span>文章分类: {{ formModel.cate_name }} </span>
      </div>
      <hr />
      <div class="imgUrl">
        <img :src="imageUrl" alt="图片" />
      </div>
      <div class="content">
        <p v-html="formModel.content"></p>
      </div>
    </div>
  </el-drawer>
</template>

<style lang="scss" scoped>
.manage-drawer {
  .avatar-uploader {
    :deep() {
      .avatar {
        width: 178px;
        height: 178px;
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
        width: 178px;
        height: 178px;
        text-align: center;
      }
    }
  }
  .editor {
    width: 100%;
    :deep(.ql-editor) {
      min-height: 200px;
    }
  }
  // 预览
  .padding-r-10 {
    padding-right: 30px;
  }
  .imgUrl {
    width: 400px;
    height: 280px;
    margin: 16px 0;
    img {
      width: 100%;
      height: 100%;
    }
  }
}
</style>
