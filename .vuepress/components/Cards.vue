<template>
  <div class="cards">
    <slot />
  </div>
</template>

<script>
export default {
  name: 'Cards'
}
</script>

<style scoped>
.cards {
  display: grid;
  /* auto-fit + minmax：按容器宽度决定列数，卡片不足时多出的空轨道会被折叠，
     剩下的卡片自动撑满整行。2 张 → 各占一半，3 张 → 三等分，6 张 → 三列两行。
     下限 11rem（176px）是实测值：内容栏的卡片网格宽约 643px，刚好仍容得下 3 列。 */
  grid-template-columns: repeat(auto-fit, minmax(11rem, 1fr));
  gap: 0.75rem;
  margin: 1rem 0;
}

@media (max-width: 719px) {
  .cards {
    grid-template-columns: 1fr;
  }
}
</style>
