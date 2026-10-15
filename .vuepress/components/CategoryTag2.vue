<template>
  <span class="category-tag inline-tag">
    <slot />
  </span>
</template>

<script>
/** 分类标签 2 号槽（蓝 #3498db）：只是一个通用色，语义由使用处定义 */
export default {
  name: 'CategoryTag2'
}
</script>

<style scoped>
.category-tag {
  background: #3498db;
  color: #fff;
}
</style>
