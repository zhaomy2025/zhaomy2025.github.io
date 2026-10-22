<template>
  <span class="category-tag inline-tag">
    <slot />
  </span>
</template>

<script>
/** 分类标签 4 号槽（青 #0891b2）：只是一个通用色，语义由使用处定义 */
export default {
  name: 'CategoryTag4'
}
</script>

<style scoped>
.category-tag {
  padding: 0.05em 0.35em;
  border-radius: 2px;
  font-size: 1em;
  font-weight: normal;
  background: #ede9fe;
  color: #4c1d95;
}
</style>
