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
  background: #6db33f;
  color: #fff;
}
</style>
