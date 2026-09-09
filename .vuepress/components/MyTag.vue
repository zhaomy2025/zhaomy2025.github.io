<template>
  <span class="my-tag inline-tag" :style="{ backgroundColor: color }">
    <slot />
  </span>
</template>

<script>
export default {
  props: {
    color: {
      type: String,
      default: '#3498db' // 默认蓝色 var(--hint-c-soft);
    }
  },
  name: 'MyTag'
}
</script>

<style>
.my-tag {
  color: white;
}
</style>