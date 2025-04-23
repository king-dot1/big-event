<script setup>
import { ArticleListService } from '@/api/article'
import { ref, onMounted } from 'vue'

const articleList = ref([])

const getArticleList = async () => {
  const res = await ArticleListService()
  articleList.value = res.data.data
}
onMounted(() => {
  getArticleList()
})

// const moduleValue = defineModel()
const emit = defineEmits(['update:modelValue'])
defineProps({
  moduleValue: {
    type: [String, Number]
  }
})
</script>

<template>
  <el-select
    :model-value="moduleValue"
    @change="emit('update:modelValue', $event)"
    placeholder="请选择"
  >
    <el-option
      v-for="item in articleList"
      :key="item.id"
      :label="item.cate_name"
      :value="item.id"
    />
  </el-select>
</template>
