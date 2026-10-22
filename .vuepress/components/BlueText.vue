<template>
  <span class="blue"><slot /></span>
</template>

<script>
export default {
  name: 'BlueText'
}
</script>

<style scoped>
.blue {
  color: #2563eb;
}
</style>
