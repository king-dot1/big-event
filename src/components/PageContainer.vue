<script setup>
defineProps({
  title: {
    require: true,
    type: String
  }
})
</script>

<template>
  <el-card class="page-container">
    <template #header>
      <div class="card-header">
        <span> {{ title }}</span>
        <div class="btn">
          <slot name="btn"></slot>
        </div>
      </div>
    </template>
    <!-- 默认插槽，展示表格 -->
    <slot></slot>
  </el-card>
</template>

<style lang="scss" scoped>
.page-container {
  min-height: 100%;
  box-sizing: border-box;
  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
}
</style>
