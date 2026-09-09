<template>
  <span class="tip inline-tag">
    <slot />
  </span>
</template>

<script>
export default {
  name: 'Tip'
}
</script>

<style scoped>
.tip {
  background: rgb(16 185 129 / 14%);
  color: #18794e;
}
</style>