<script setup>
import { ref } from 'vue'
import { Delete, Edit } from '@element-plus/icons-vue'
import dialogEdit from './components/dialogEdit.vue'
import { ArticleListService, ArticleDeleteService } from '@/api/article'
import { ElMessage, ElMessageBox } from 'element-plus'

const tableData = ref([])
const loading = ref(true)

// 获取 -文章列表
const getArticleList = async () => {
  loading.value = true
  const res = await ArticleListService()
  tableData.value = res.data.data
  loading.value = false
}
getArticleList()

// 拿到弹层元素
const dislogRef = ref()

// 打开 弹层
const onEditChannel = (row) => {
  dislogRef.value.open(row)
}
const onAddChannel = () => {
  dislogRef.value.open()
}

// 删除
const onDeleteChannel = async (row) => {
  await ElMessageBox.confirm('你确认删除该分类信息吗？', '温馨提示', {
    type: 'warning',
    confirmButtonText: '确认',
    cancelButtonText: '取消'
  })
  await ArticleDeleteService(row.id)
  ElMessage({
    message: '删除成功',
    type: 'success'
  })

  // 重新获取列表
  getArticleList()
}

// 添加成功后，重新获取列表
const onSuccess = () => {
  getArticleList()
}
</script>

<template>
  <page-container class="article-channel" title="文章分类">
    <template #btn>
      <el-button @click="onAddChannel" type="primary">添加分类</el-button>
    </template>
    <el-table v-loading="loading" :data="tableData" style="width: 100%">
      <el-table-column type="index" label="序号" width="100" />
      <el-table-column prop="cate_name" label="分类名称" />
      <el-table-column prop="cate_alias" label="分类别名" />
      <el-table-column prop="address" label="操作" width="100">
        <template #default="scope">
          <el-button
            @click="onEditChannel(scope.row)"
            plain
            type="primary"
            :icon="Edit"
            circle
          />
          <el-button
            @click="onDeleteChannel(scope.row)"
            plain
            type="danger"
            :icon="Delete"
            circle
          />
        </template>
      </el-table-column>

      <!-- table 提供的empty插槽；无数据时显示 -->
      <template #empty>
        <el-empty description="没有数据" />
      </template>
    </el-table>
    <dialogEdit @success="onSuccess" ref="dislogRef"></dialogEdit>
  </page-container>
</template>

<style lang="scss" scoped></style>
