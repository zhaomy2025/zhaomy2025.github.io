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
  padding: 0.05em 0.35em;
  border-radius: 2px;
  font-size: 1em;
  font-weight: normal;
  background: #dbeafe;
  color: #1e3a8a;
}
</style>
