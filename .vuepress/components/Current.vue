<template>
  <span class="current inline-tag">
    <slot />
  </span>
</template>

<script>
export default {
  name: 'Current'
}
</script>

<style scoped>
.current {
  background: rgb(16 185 129 / 14%);
  color: #18794e;
}
</style>
