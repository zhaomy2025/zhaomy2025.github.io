<template>
  <span class="danger  inline-tag">
    <slot />
  </span>
</template>

<script>
export default {
  name: 'Danger'
}
</script>

<style scoped>
.danger {
  background: rgb(244 63 94 / 14%);
  color: #b8272c;
}
</style>