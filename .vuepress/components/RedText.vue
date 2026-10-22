<template>
  <span class="red"><slot /></span>
</template>

<script>
export default {
  name: 'RedText'
}
</script>

<style scoped>
.red {
  color: #dc2626;
}
</style>
