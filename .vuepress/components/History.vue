<template>
  <span class="history inline-tag">
    <slot />
  </span>
</template>

<script>
export default {
  name: 'History'
}
</script>

<style scoped>
.history {
  background: rgb(107 114 128 / 14%);
  color: #4b5563;
}
</style>
