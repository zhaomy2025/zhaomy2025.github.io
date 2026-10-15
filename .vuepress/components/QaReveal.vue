<template>
  <div class="qa-reveal" tabindex="0">
    <p class="qa-q">{{ q }}</p>
    <p class="qa-a">{{ a }}</p>
  </div>
</template>

<script>
/**
 * 问答条：问题常显，答案默认隐藏，鼠标悬浮（或键盘聚焦）时显示。
 * 问题与答案都走 prop 传纯文本 —— 组件插槽里的 markdown 不解析，所以不用 slot。
 */
export default {
  name: 'QaReveal',
  props: {
    /** 问题：始终显示 */
    q: {
      type: String,
      required: true
    },
    /** 答案：默认隐藏，悬停 / 聚焦时显示 */
    a: {
      type: String,
      required: true
    }
  }
}
</script>

<style scoped>
.qa-reveal {
  margin: 0.6rem 0;
  padding: 0.45rem 0.8rem;
  border-left: 3px solid var(--vp-c-accent);
  border-radius: 0.3rem;
  background: var(--vp-c-bg-alt);
  cursor: help;
  outline: none;
}

.qa-reveal:focus-visible {
  box-shadow: 0 0 0 2px var(--vp-c-accent);
}

.qa-q {
  margin: 0;
  font-weight: 700;
  color: var(--vp-c-text);
}

.qa-a {
  /* 预留高度：答案始终占位，只切换 visibility / opacity 显隐。
     悬停时答案淡入、不改变布局，页面不会被推来推去。 */
  margin: 0.3rem 0 0;
  font-size: 0.92em;
  line-height: 1.65;
  color: var(--vp-c-text);
  opacity: 0;
  visibility: hidden;
  transition: opacity 0.18s ease, visibility 0.18s ease;
}

.qa-reveal:hover .qa-a,
.qa-reveal:focus-within .qa-a {
  opacity: 1;
  visibility: visible;
}
</style>
