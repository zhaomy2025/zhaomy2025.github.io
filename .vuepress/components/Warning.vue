<template>
  <span class="warning inline-tag">
    <slot />
  </span>
</template>

<script>
export default {
  name: 'Warning'
}
</script>

<style scoped>
.warning {
  background: rgb(234 179 8 / 14%);
  color: #915930;
}
</style>