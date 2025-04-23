<script setup>
import { ref } from 'vue'
import { Edit, Delete } from '@element-plus/icons-vue'
import {
  ArticleManageListService,
  ArticleDeleteByIdService
} from '@/api/article'
import { formatDate } from '@/utils/format'
import channelSelect from './components/channelSelect.vue'
import manageDrawer from './components/manageDrawer.vue'

const tableData = ref([])
const total = ref(0)
const params = ref({ pagenum: 1, pagesize: 5, cate_id: '', state: '' })
const loading = ref(true) // 控制表格数据的 loading

const articleManageList = async () => {
  loading.value = true
  const res = await ArticleManageListService(params.value)
  total.value = res.data.total
  tableData.value = res.data.data
  loading.value = false
}
articleManageList()

const handleSizeChange = (size) => {
  params.value.pagenum = 1
  params.value.pagesize = size
  articleManageList()
}

const handleCurrentChange = (num) => {
  params.value.pagenum = num
  articleManageList()
}

// 重置搜索框
const reset = () => {
  params.value.cate_id = ''
  params.value.state = ''
  articleManageList()
}

const drawerRef = ref()
// 发布
const onAddManage = () => {
  drawerRef.value.open()
}
// 编辑
const onEditManage = (row) => {
  drawerRef.value.open(row)
}
// 预览
const onPreviewManage = (row) => {
  drawerRef.value.open(row)
}
// 删除
const onDeleteManage = async (row) => {
  await ElMessageBox.confirm('你确认删除该文章信息吗？', '温馨提示', {
    type: 'warning',
    confirmButtonText: '确认',
    cancelButtonText: '取消'
  })

  await ArticleDeleteByIdService(row.id)
  ElMessage({
    message: '删除成功',
    type: 'success'
  })
  articleManageList()
}

const onSuccess = (type) => {
  // 是发布，要到最后一页；是编辑，返回第一页
  if (type === 'add') {
    params.value.pagenum = Math.ceil((total.value + 1) / params.value.pagesize)
  } else {
    params.value.pagenum = 1
  }
  articleManageList()
}
</script>

<template>
  <page-container class="article-manage" title="文章管理">
    <template #btn>
      <el-button @click="onAddManage" type="primary">发布文章</el-button>
    </template>
    <!-- 搜索 -->
    <el-form :inline="true" class="demo-form-inline">
      <el-form-item label="文章分类：">
        <!-- 子组件 -->
        <channel-select v-model="params.cate_id" />
      </el-form-item>
      <el-form-item label="发布状态：">
        <el-select v-model="params.state" placeholder="请选择">
          <el-option label="已发布" value="已发布" />
          <el-option label="草稿" value="草稿" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button @click="articleManageList()" type="primary">搜索</el-button>
        <el-button @click="reset">重置</el-button>
      </el-form-item>
    </el-form>
    <!-- 表格 -->
    <el-table v-loading="loading" :data="tableData" style="width: 100%">
      <el-table-column prop="title" label="文章标题">
        <template #default="scope">
          <el-link
            @click="onPreviewManage(scope.row)"
            :underline="false"
            type="primary"
            >{{ scope.row.title }}</el-link
          >
        </template>
      </el-table-column>
      <el-table-column prop="cate_name" label="分类" />
      <el-table-column prop="pub_date" label="发表时间">
        <!-- 利用插槽 使用日期格式化 -->
        <template #default="scope">
          {{ formatDate(scope.row.pub_date) }}
        </template>
      </el-table-column>
      <el-table-column prop="state" label="状态" />
      <el-table-column prop="address" label="操作" width="100">
        <template #default="scope">
          <el-button
            @click="onEditManage(scope.row)"
            plain
            type="primary"
            :icon="Edit"
            circle
          />
          <el-button
            @click="onDeleteManage(scope.row)"
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
    <!-- 抽屉 -->
    <manageDrawer @success="onSuccess" ref="drawerRef"></manageDrawer>
    <!-- 分页 -->
    <el-pagination
      background
      layout="jumper, total, sizes, prev, pager, next"
      v-model:current-page="params.pagenum"
      v-model:page-size="params.pagesize"
      :page-sizes="[2, 3, 4, 5, 10]"
      :total="total"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      style="margin-top: 20px; justify-content: flex-end"
    />
  </page-container>
</template>

<style lang="scss" scoped>
.article-manage {
  .demo-form-inline {
    :deep(.el-select__selection) {
      width: 175px;
    }
  }
}
</style>
