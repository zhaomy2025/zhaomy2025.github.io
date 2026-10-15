<template>
  <span class="category-tag inline-tag">
    <slot />
  </span>
</template>

<script>
/** 分类标签 3 号槽（橙 #ea580c）：只是一个通用色，语义由使用处定义 */
export default {
  name: 'CategoryTag3'
}
</script>

<style scoped>
.category-tag {
  background: #ea580c;
  color: #fff;
}
</style>
