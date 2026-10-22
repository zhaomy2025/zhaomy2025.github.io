<template>
  <span class="category-tag inline-tag">
    <slot />
  </span>
</template>

<script>
/** 分类标签 3 号槽（浅橙 #ffedd5 / 边框 #ea580c）：只是一个通用色，语义由使用处定义 */
export default {
  name: 'CategoryTag3'
}
</script>

<style scoped>
.category-tag {
  padding: 0.05em 0.35em;
  border-radius: 2px;
  font-size: 1em;
  font-weight: normal;
  background: #ffedd5;
  color: #7c2d12;
}
</style>
