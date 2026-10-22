<template>
  <span class="category-tag inline-tag">
    <slot />
  </span>
</template>

<script>
/** 分类标签 1 号槽（绿 #6db33f）：只是一个通用色，语义由使用处定义 */
export default {
  name: 'CategoryTag1'
}
</script>

<style scoped>
.category-tag {
  padding: 0.05em 0.35em;
  border-radius: 2px;
  font-size: 1em;
  font-weight: normal;
  background: #dcfce7;
  color: #14532d;
}
</style>
