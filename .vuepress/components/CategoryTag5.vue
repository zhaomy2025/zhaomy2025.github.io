<template>
  <span class="category-tag inline-tag">
    <slot />
  </span>
</template>

<script>
/** 分类标签 5 号槽（灰 #6b7280）：只是一个通用色，语义由使用处定义 */
export default {
  name: 'CategoryTag5'
}
</script>

<style scoped>
.category-tag {
  background: #6b7280;
  color: #fff;
}
</style>
