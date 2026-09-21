<script setup lang="ts">
import VPFadeSlideYTransition from '@theme/VPFadeSlideYTransition.vue'
import VPHome from '@theme/VPHome.vue'
import VPNavbar from '@theme/VPNavbar.vue'
import VPPage from '@theme/VPPage.vue'
import VPSidebar from '@theme/VPSidebar.vue'
import { useData } from '@theme/useData'
import { useScrollPromise } from '@theme/useScrollPromise'
import { useSidebarItems } from '@theme/useSidebarItems'
import type { Slot } from '@vuepress/helper/client'
import { computed, onMounted, ref, watch } from 'vue'
import { onContentUpdated } from 'vuepress/client'

defineSlots<{
  'navbar'?: Slot
  'navbar-before'?: Slot
  'navbar-after'?: Slot
  'sidebar'?: Slot
  'sidebar-top'?: Slot
  'sidebar-bottom'?: Slot
  'page'?: Slot
  'page-top'?: Slot
  'page-bottom'?: Slot
  'page-content-top'?: Slot
  'page-content-bottom'?: Slot
}>()

const { frontmatter, page, themeLocale } = useData()

// navbar
const shouldShowNavbar = computed(
  () => frontmatter.value.navbar ?? themeLocale.value.navbar ?? true,
)

// sidebar
const sidebarItems = useSidebarItems()
const isSidebarOpen = ref(false)
const isSidebarCollapsed = ref(false)
const toggleSidebar = (to?: boolean): void => {
  isSidebarOpen.value = typeof to === 'boolean' ? to : !isSidebarOpen.value
}
const sidebarToggleLabel = computed(() =>
  isSidebarCollapsed.value ? '展开侧边栏' : '收起侧边栏',
)
const updateSidebarButton = (): void => {
  const buttons = document.querySelectorAll<HTMLElement>(
    '.vp-toggle-sidebar-button, .vp-desktop-sidebar-toggle',
  )
  buttons.forEach((button) => {
    button.setAttribute('aria-label', sidebarToggleLabel.value)
    button.setAttribute('title', sidebarToggleLabel.value)
    button.setAttribute(
      'aria-expanded',
      String(!isSidebarCollapsed.value),
    )
  })
}
const toggleSidebarByViewport = (): void => {
  if (window.innerWidth <= 959) {
    toggleSidebar()
  } else {
    isSidebarCollapsed.value = !isSidebarCollapsed.value
  }
}
onMounted(updateSidebarButton)
watch([isSidebarCollapsed, isSidebarOpen], updateSidebarButton)

const touchStart = { x: 0, y: 0 }
const onTouchStart = (e: TouchEvent): void => {
  touchStart.x = e.changedTouches[0].clientX
  touchStart.y = e.changedTouches[0].clientY
}
const onTouchEnd = (e: TouchEvent): void => {
  const dx = e.changedTouches[0].clientX - touchStart.x
  const dy = e.changedTouches[0].clientY - touchStart.y
  if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 40) {
    if (dx > 0 && touchStart.x <= 80) {
      toggleSidebar(true)
    } else {
      toggleSidebar(false)
    }
  }
}

// external-link-icon
const enableExternalLinkIcon = computed(
  () =>
    frontmatter.value.externalLinkIcon ??
    themeLocale.value.externalLinkIcon ??
    true,
)

// classes
const containerClass = computed(() => [
  {
    'no-navbar': !shouldShowNavbar.value,
    'no-sidebar': !sidebarItems.value.length,
    'sidebar-open': isSidebarOpen.value,
    'sidebar-collapsed': isSidebarCollapsed.value,
    'external-link-icon': enableExternalLinkIcon.value,
  },
  frontmatter.value.pageClass,
])

// 点击 navbar 项（侧边栏中的导航链接）时不自动关闭侧边栏，
// 点击侧边栏文章链接时自动关闭
const sidebarNavClicked = ref(false)
const onSidebarClick = (e: MouseEvent): void => {
  const target = e.target as HTMLElement
  sidebarNavClicked.value =
    target.closest('.vp-sidebar .vp-navbar-item') !== null &&
    target.closest('.vp-sidebar .vp-navbar-dropdown-item') === null
}
const onSidebarItemClick = (e: MouseEvent): void => {
  const target = e.target as HTMLElement
  if (
    window.innerWidth <= 959 &&
    (target.closest('.vp-sidebar .vp-navbar-item') === null ||
      target.closest('.vp-sidebar .vp-navbar-dropdown-item') !== null)
  ) {
    toggleSidebar(false)
  }
}
onContentUpdated(() => {
  if (!sidebarNavClicked.value) {
    toggleSidebar(false)
  }
  sidebarNavClicked.value = false
})

// handle scrollBehavior with transition
const scrollPromise = useScrollPromise()
const onBeforeEnter = scrollPromise.resolve
const onBeforeLeave = scrollPromise.pending
</script>

<template>
  <div
    class="vp-theme-container"
    :class="containerClass"
    vp-container
    @touchstart="onTouchStart"
    @touchend="onTouchEnd"
  >
    <slot name="navbar">
      <VPNavbar
        v-if="shouldShowNavbar"
        @toggle-sidebar="toggleSidebarByViewport"
      >
        <template #before>
          <slot name="navbar-before" />
        </template>
        <template #after>
          <slot name="navbar-after" />
        </template>
      </VPNavbar>
    </slot>

    <button
      class="vp-desktop-sidebar-toggle vp-desktop-sidebar-toggle--arrow-only"
      type="button"
      @click="toggleSidebarByViewport"
    >
      <span class="icon" aria-hidden="true" />
    </button>

    <div class="vp-sidebar-mask" @click="toggleSidebar(false)" />

    <slot name="sidebar">
      <VPSidebar @click="onSidebarClick" @click.capture="onSidebarItemClick">
        <template #top>
          <slot name="sidebar-top" />
        </template>
        <template #bottom>
          <slot name="sidebar-bottom" />
        </template>
      </VPSidebar>
    </slot>

    <slot name="page">
      <VPFadeSlideYTransition
        @before-enter="onBeforeEnter"
        @before-leave="onBeforeLeave"
      >
        <VPHome v-if="frontmatter.home" />
        <VPPage v-else :key="page.path">
          <template #top>
            <slot name="page-top" />
          </template>
          <template #content-top>
            <slot name="page-content-top" />
          </template>
          <template #content-bottom>
            <slot name="page-content-bottom" />
          </template>
          <template #bottom>
            <slot name="page-bottom" />
          </template>
        </VPPage>
      </VPFadeSlideYTransition>
    </slot>
  </div>
</template>

<style lang="scss">
@use '@vuepress/theme-default/lib/client/styles/variables' as *;

.vp-sidebar-mask {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 9;

  display: none;

  width: 100vw;
  height: 100vh;
}

.vp-theme-container {
  // navbar is disabled
  &.no-navbar {
    .vp-sidebar {
      top: 0;

      @media (max-width: $MQMobile) {
        padding-top: 0;
      }
    }

    .vp-page {
      padding-top: 0;
    }

    // adjust heading margin and padding;
    [vp-content] {
      h1,
      h2,
      h3,
      h4,
      h5,
      h6 {
        margin-top: 1.5rem;
        padding-top: 0;
      }
    }
  }

  &.no-sidebar {
    // hide sidebar
    .vp-sidebar {
      display: none;

      // show sidebar on mobile because it has navbar links
      @media (max-width: $MQMobile) {
        display: block;
      }
    }

    .vp-page {
      padding-inline-start: 0;
    }
  }

  &.sidebar-collapsed {
    @media (min-width: $MQNarrow + 1px) {
      .vp-sidebar {
        transform: translateX(-100%);
      }

      .vp-page {
        padding-inline-start: 0;
      }

      [vp-content] {
        max-width: none;
      }
    }
  }

  &.sidebar-open {
    @media (max-width: $MQMobile) {
      // show sidebar
      .vp-sidebar {
        transform: translateX(0);
      }

      // show sidebar mask
      .vp-sidebar-mask {
        display: block;
      }
    }
  }
}
</style>
