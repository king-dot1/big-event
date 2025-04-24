<script setup>
import { ref } from 'vue'
import { ArticleEditService, ArticleAddService } from '@/api/article'

const dialogVisible = ref(false)
const formRef = ref()
// 确定按钮的loading
const btnLoading = ref(false)

// 表单数据
const formModel = ref({
  cate_name: '',
  cate_alias: ''
})
// 表单校验
const rules = {
  cate_name: [
    {
      required: true,
      message: '请输入分类名称',
      trigger: 'blur'
    },
    {
      pattern: /^.{1,10}$/,
      message: '请输入1-10个非空字符',
      trigger: 'blur'
    }
  ],
  cate_alias: [
    {
      required: true,
      message: '请输入分类别名',
      trigger: 'blur'
    },
    {
      pattern: /^[a-zA-Z0-9]{1,15}$/,
      message: '请输入1-15个大小写字母和数字组成的字符',
      trigger: 'blur'
    }
  ]
}

// 组件对外暴露的方法 open
// open({}) => 无数据，添加
// open({id,...}) => 有数据，编辑并回显数据
// open() 方法；控制 dialogVisible 的显示与隐藏
const open = (row) => {
  dialogVisible.value = true

  // 重置表单校验
  formRef.value?.clearValidate()

  if (row?.id) {
    formModel.value = { ...row }
  } else {
    // 重置表单
    formModel.value = {
      cate_name: '',
      cate_alias: ''
    }
  }
}

const emit = defineEmits(['success'])

const onArticleAdd = async () => {
  await formRef.value.validate()
  btnLoading.value = true
  // 判断是编辑还是添加
  formModel.value.id
    ? await ArticleEditService(formModel.value)
    : await ArticleAddService(formModel.value)

  btnLoading.value = false
  ElMessage({
    message: formModel.value.id ? '编辑成功' : '添加成功',
    type: 'success'
  })

  // 成功给父组件发送事件，让父组件重新请求数据
  emit('success')
  dialogVisible.value = false
}

// 对外暴露方法
defineExpose({
  open
})
</script>

<template>
  <el-dialog
    v-model="dialogVisible"
    :title="formModel.id ? '编辑分类' : '添加分类'"
    width="30%"
  >
    <el-form :model="formModel" :rules="rules" ref="formRef">
      <el-form-item label="分类名称" prop="cate_name">
        <el-input v-model="formModel.cate_name"></el-input>
      </el-form-item>
      <el-form-item label="分类别名" prop="cate_alias">
        <el-input v-model="formModel.cate_alias"></el-input>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="onArticleAdd" :loading="btnLoading">
          确定
        </el-button>
      </span>
    </template>
  </el-dialog>
</template>
