import { defineClientConfig } from 'vuepress/client'
import { defineMermaidConfig } from 'vuepress-plugin-md-enhance/client'
import Layout from './layouts/Layout.vue'
import Article from './layouts/Article.vue'
import Category from './layouts/Category.vue'
import Tag from './layouts/Tag.vue'
import Timeline from './layouts/Timeline.vue'
import MyTag from './components/MyTag.vue'
import Tip from './components/Tip.vue'
import Warning from './components/Warning.vue'
import Danger from "./components/Danger.vue"
import Card from './components/Card.vue'
import Cards from './components/Cards.vue'
import CategoryTag1 from './components/CategoryTag1.vue'
import CategoryTag2 from './components/CategoryTag2.vue'
import CategoryTag3 from './components/CategoryTag3.vue'
import CategoryTag4 from './components/CategoryTag4.vue'
import CategoryTag5 from './components/CategoryTag5.vue'
import QaReveal from './components/QaReveal.vue'

// mermaid 默认会给没有成员/方法的类补一个空的成员栏和两条分隔线，类图上全是空框。
// 关掉它，类图只按实际内容占高。
//
// 「有方法、但没有成员」的类框里还有另一处空白：classBox 调 textHelper 时把空的 members 组
// 兜底成 GAP/2，再把 methods 组下移到 membersGroupHeight + GAP*4（GAP = config.class.padding），
// 于是「类名 → 首个方法」之间固定空出 4.5 × padding，中间还夹着两条分隔线围出的一条空带。
// 这一段配置关不掉：padding 同时管类框的内边距，调小会把文字顶到框边上（实测 padding 6 → 间距
// 27px，4 → 18px，3 → 13.5px，但左右内边距同步缩到 4/3px）。所以 padding 保持 6 不动，改在
// 渲染后按几何把这一截收掉 —— 见下面的 collapseEmptyMembersBand。
//
// 类图默认会跟着容器等比缩小：svg 带 width:100% + style="max-width:<原始宽度>"，容器比原始宽度窄时
// 整张图被压小 —— 实测 collection-framework 那张 3162px 宽的图被压到 0.2，类名只剩约 3px 不可读。
// 关掉 useMaxWidth 让它按原始尺寸渲染，超宽时在容器内横向滚动；这和本站 flowchart / sequence 图的
// 行为一致（md-enhance 对那几种图本来就传 useMaxWidth:false）。
//
// 取值来源要分两块看（mermaid 11.13，实测 + 源码）：
// - useMaxWidth / nodeSpacing / rankSpacing / titleTopMargin：类图渲染器 classRenderer-v3-unified
//   读的是 config.state，不是 config.class —— 实测只设 class.useMaxWidth:false 没有任何效果，
//   必须设 state；class 里也保留一份，以防日后升级修掉这个取值问题。
// - padding：是 classBox 这个 shape 自己读 config.class.padding（`class.padding ?? 12`），
//   必须留在 class 下；挪到 state 无效 —— state.padding 只被状态图（state/shapes.js）读。
defineMermaidConfig({
  class: { hideEmptyMembersBox: true, padding: 6, useMaxWidth: false },
  state: { useMaxWidth: false },
})

// ===== 类图「空 members 带」的后处理 =====
//
// mermaid 11.13 的 classBox 对「有方法、无成员」的类，会画出这样一坨：
//   类名 / 4.5×padding 的空白 / 分隔线 / 空 members 带 / 分隔线 / 首个方法
// 这里在渲染完成后按实测几何把它压成：类名 / 一条分隔线 / 首个方法，做法三步：
//   ① methods 组整组上移，使「类名底 → 首个方法顶」= CLASSBOX_GAP；
//   ② 两条分隔线删掉，按新位置重画一条；
//   ③ 类框底边上移同样的量 —— rough.js 的轮廓是绝对坐标写死的 <path>，改 d 里 y 等于底边的点。
// 只处理「有方法、无成员」的类；无方法的类由 hideEmptyMembersBox 走紧凑路径，有成员的类本来
// 就没有空带，两者都不动。

const CLASSBOX_GAP = 10 // 「类名」底 →「首个方法」顶的目标间距（SVG 用户单位）
const CLASSBOX_DIV_OFFSET = 4.5 // 分隔线落在「类名」底下方多少
const SVG_NS = 'http://www.w3.org/2000/svg'

// 元素自身的 translate（类图里 mermaid 只写 translate(x, y)）
function svgTranslate(el) {
  const list = el.transform && el.transform.baseVal
  if (!list || !list.numberOfItems) return { x: 0, y: 0 }
  const m = list.consolidate().matrix
  return { x: m.e, y: m.f }
}

// 元素内容在其父坐标系里的纵向范围（含元素自身的 translate）
function svgVerticalRange(el) {
  const box = el.getBBox()
  const y = svgTranslate(el).y
  return { top: box.y + y, bottom: box.y + box.height + y }
}

// 把 path 的 d 里落在 fromY 那一层的点整体上移 delta。
// rough.js 在 roughness = 0 / handDrawn 下画的矩形和直线都只用 M / L / C，且被移动的那条边
// 上所有点（端点 + 控制点）y 都等于 fromY，其余点不动，所以按 y 值挑点即可，不必解析路径语义。
function shiftPathBottom(path, fromY, delta) {
  const d = path.getAttribute('d')
  if (!d) return
  path.setAttribute(
    'd',
    d.replace(/([MLC])([^MLC]*)/g, (whole, cmd, args) => {
      const nums = args.match(/-?\d*\.?\d+(?:e[-+]?\d+)?/gi) || []
      const out = []
      for (let i = 0; i + 1 < nums.length; i += 2) {
        const x = parseFloat(nums[i])
        const y = parseFloat(nums[i + 1])
        out.push(Number(x.toFixed(4)), Number(Math.abs(y - fromY) < 0.01 ? y - delta : y).toFixed(4))
      }
      return cmd + ' ' + out.join(' ')
    }),
  )
}

// 返回值 true = 这轮没量到有效几何、之后要重试；false = 已处理完（收掉了 / 本来就轮不到它）。
function collapseEmptyMembersBand(node) {
  if (node.getAttribute('data-classbox-collapsed') === '1') return false
  const members = node.querySelector(':scope > .members-group')
  const methods = node.querySelector(':scope > .methods-group')
  const label = node.querySelector(':scope > .label-group')
  const box = node.querySelector(':scope > g.label-container')
  if (!members || !methods || !label || !box) return false
  if (members.childElementCount > 0) return false // 有成员：本来就有内容，空带不存在
  if (methods.childElementCount === 0) return false // 无方法：hideEmptyMembersBox 已经给的是紧凑框

  // 只认 rough.js 这套 M / L / C 的路径。出现别的命令就整块放弃、保持现状 ——
  // 宁可留着空带，也不要按错的前提去改框。
  const boxPaths = [...box.querySelectorAll('path')]
  const usable = boxPaths.length > 0 && boxPaths.every((p) => {
    const d = p.getAttribute('d') || ''
    return d.length > 0 && !/[^MLCZ\d\s.,eE+-]/.test(d)
  })
  if (!usable) return false

  const labelRange = svgVerticalRange(label)
  const methodsRange = svgVerticalRange(methods)
  // 元素还没参与布局（图放在折叠的 code-tabs 里、或 SVG 刚挂上还没回流）时 getBBox 全是 0。
  // 这时既不能量也不能打标记，返回 true 让调用方稍后重试。
  if (labelRange.bottom - labelRange.top <= 0 || methodsRange.bottom - methodsRange.top <= 0) return true

  const delta = methodsRange.top - labelRange.bottom - CLASSBOX_GAP
  if (delta <= 0.5) return false
  // 标记一定要打在「真收掉了」之后：早打标记会让上面那个重试分支永远短路，
  // 这张图就卡在 mermaid 原样、再也不收口了（踩过）。
  node.setAttribute('data-classbox-collapsed', '1')

  // ① 方法组上移
  const t = svgTranslate(methods)
  methods.setAttribute('transform', `translate(${t.x}, ${t.y - delta})`)

  // ② 两条分隔线合成一条：删掉原来的，按新位置重画（line 与 rough 的直线同形，粗糙度为 0）
  const boxBox = box.getBBox()
  const dividers = [...node.querySelectorAll(':scope > g.divider')]
  let stroke = ''
  let strokeWidth = ''
  let style = ''
  dividers.forEach((g) => {
    const path = g.querySelector('path')
    if (path) {
      stroke = path.getAttribute('stroke') || stroke
      strokeWidth = path.getAttribute('stroke-width') || strokeWidth
      style = path.getAttribute('style') || style
    }
    g.remove()
  })
  if (dividers.length) {
    const line = document.createElementNS(SVG_NS, 'line')
    const y = labelRange.bottom + CLASSBOX_DIV_OFFSET
    line.setAttribute('x1', boxBox.x)
    line.setAttribute('y1', y)
    line.setAttribute('x2', boxBox.x + boxBox.width)
    line.setAttribute('y2', y)
    line.setAttribute('class', 'divider')
    if (stroke) line.setAttribute('stroke', stroke)
    if (strokeWidth) line.setAttribute('stroke-width', strokeWidth)
    if (style) line.setAttribute('style', style)
    box.after(line)
  }

  // ③ 类框底边同步上移，避免框底留一截死白
  const bottomY = boxBox.y + boxBox.height
  boxPaths.forEach((p) => shiftPathBottom(p, bottomY, delta))
  return false
}

// 扫全站所有 classDiagram 节点。返回值 = 是否还有节点没量到几何（需要稍后重试）。
function fixClassBoxes() {
  let pending = false
  document.querySelectorAll('svg').forEach((svg) => {
    if (!svg.querySelector('.methods-group')) return
    svg.querySelectorAll('g.node').forEach((node) => {
      // getBBox 在元素尚未挂载 / 不可见时会抛错，跳过即可，下次 DOM 变动会再试
      try {
        if (collapseEmptyMembersBand(node)) pending = true
      } catch (e) {
        /* 忽略：这里只是样式收口，失败了保持 mermaid 原样 */
      }
    })
  })
  return pending
}

// 渲染后处理入口。md-enhance 的 Mermaid 组件是客户端异步渲染完再把 <svg> 塞进 .mermaid-content 的，
// 没有暴露 hook，所以用 MutationObserver 盯着新增的 svg（切深浅色会重渲染，同样能被捕捉）。
function setupClassBoxFix() {
  if (typeof window === 'undefined' || typeof MutationObserver === 'undefined') return
  if (window.__classBoxFixStarted) return
  window.__classBoxFixStarted = true

  let scheduled = false
  let retries = 0
  const RETRY_DELAY = 120
  const MAX_RETRIES = 10
  // 用 setTimeout 而不是 requestAnimationFrame 做去抖：后台标签页里 rAF 根本不触发，
  // 用它会让 scheduled 永远停在 true、后续 DOM 变动再也排不上队（实测踩过）。
  const schedule = (retry = false) => {
    if (!retry) retries = 0
    if (scheduled) return
    scheduled = true
    window.setTimeout(() => {
      scheduled = false
      if (fixClassBoxes() && retries < MAX_RETRIES) {
        // 还有节点的几何没就绪（字体 / 布局未落定）→ 稍后再来一遍。
        // 已经收掉的节点会走 data-classbox-collapsed 短路，重跑一遍很便宜。
        retries += 1
        schedule(true)
      }
    }, retry ? RETRY_DELAY : 30)
  }

  new MutationObserver((records) => {
    for (const record of records) {
      for (const added of record.addedNodes) {
        if (added.nodeType !== 1) continue
        if (added.tagName === 'svg' || added.querySelector?.('svg')) {
          schedule()
          return
        }
      }
    }
  }).observe(document.documentElement, { childList: true, subtree: true })

  schedule()
}

export default defineClientConfig({
  // we provide some blog layouts
  layouts: {
    Layout,
    Article,
    Category,
    Tag,
    Timeline,
  },
  enhance({ app }) {
    app.component('MyTag', MyTag)
    app.component('Tip', Tip)
    app.component('Warning', Warning)
    app.component('Danger', Danger)
    app.component('Card', Card)
    app.component('Cards', Cards)
    app.component('CategoryTag1', CategoryTag1)
    app.component('CategoryTag2', CategoryTag2)
    app.component('CategoryTag3', CategoryTag3)
    app.component('CategoryTag4', CategoryTag4)
    app.component('CategoryTag5', CategoryTag5)
    app.component('QaReveal', QaReveal)
    setupClassBoxFix()
  },
})
