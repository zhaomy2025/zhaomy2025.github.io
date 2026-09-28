<template>
  <div class="card">
    <p v-if="title" class="card-title">{{ title }}</p>
    <p class="card-text"><slot /></p>
  </div>
</template>

<script>
export default {
  name: 'Card',
  props: {
    /** 卡片标题，留空则只显示正文 */
    title: {
      type: String,
      default: ''
    }
  }
}
</script>

<style scoped>
.card {
  padding: 0.75rem 0.9rem;
  border: 1px solid var(--vp-c-border);
  border-radius: 0.4rem;
  background: var(--vp-c-bg-alt);
}

.card-title {
  margin: 0 0 0.35rem;
  font-weight: 700;
  color: var(--vp-c-accent);
}

.card-text {
  margin: 0;
  font-size: 0.9em;
  line-height: 1.65;
}
</style>
