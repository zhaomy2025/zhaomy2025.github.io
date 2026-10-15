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
  background: #0891b2;
  color: #fff;
}
</style>
