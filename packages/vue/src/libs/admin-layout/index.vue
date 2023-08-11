<template>
  <div :class="[':soy: relative h-full', commonClass]" :style="cssVars">
    <div
      :id="isWrapperScroll ? scrollElId : undefined"
      :class="[
        ':soy: flex flex-col h-full',
        commonClass,
        scrollWrapperClass,
        { ':soy: overflow-y-auto': isWrapperScroll }
      ]"
    >
      <!-- 头部 -->
      <template v-if="showHeader">
        <header
          v-show="!fullContent"
          :class="[
            style['layout-header'],
            ':soy: flex-shrink-0',
            commonClass,
            headerClass,
            headerLeftGapClass,
            { ':soy: absolute top-0 left-0 w-full': fixedHeaderAndTab }
          ]"
        >
          <slot name="header"></slot>
        </header>
        <div
          v-show="!fullContent && fixedHeaderAndTab"
          :class="[style['layout-header-placement'], ':soy: flex-shrink-0 overflow-hidden']"
        ></div>
      </template>

      <!-- 页签 -->
      <template v-if="showTab">
        <div
          v-show="!fullContent"
          :class="[
            style['layout-tab'],
            ':soy: flex-shrink-0',
            commonClass,
            tabClass,
            { 'top-0!': !showHeader },
            leftGapClass,
            { ':soy: absolute left-0 w-full': fixedHeaderAndTab }
          ]"
        >
          <slot name="tab"></slot>
        </div>
        <div
          v-show="!fullContent && fixedHeaderAndTab"
          :class="[style['layout-tab-placement'], ':soy: flex-shrink-0 overflow-hidden']"
        ></div>
      </template>

      <!-- 侧边栏 -->
      <template v-if="showSider">
        <aside
          v-show="!fullContent"
          :style="!siderCollapseRef ? { width: siderWidthRef + 'px' } : {}"
          :class="[
            ':soy: absolute left-0 top-0 h-full',
            commonClass,
            siderClass,
            siderPaddingClass,
            siderCollapseRef ? style['layout-sider_collapsed'] : style['layout-sider']
          ]"
        >
          <slot name="sider"></slot>
          <div
            :style="{ display: !siderCollapseRef && siderDrag ? 'block ' : 'none' }"
            class="drag-handle"
            @mousedown="startResizeFn"
          >
            <div class="resize-line" :style="{ display: isResizingRef ? 'block' : 'none' }"></div>
          </div>
        </aside>
      </template>

      <!-- 移动端的侧边栏 -->
      <template v-if="showMobileSider">
        <aside
          :class="[
            ':soy: absolute left-0 top-0 w-0 h-full bg-white',
            commonClass,
            mobileSiderClass,
            style['layout-mobile-sider'],
            siderCollapse ? 'overflow-hidden' : style['layout-sider']
          ]"
        >
          <slot name="sider"></slot>
        </aside>
        <div
          v-show="!siderCollapse"
          :class="[':soy: absolute left-0 top-0 w-full h-full bg-[rgba(0,0,0,0.2)]', style['layout-mobile-sider-mask']]"
          @click="handleClickMask"
        ></div>
      </template>

      <!-- 主体 -->
      <main
        :id="isContentScroll ? scrollElId : undefined"
        :class="[
          ':soy: flex flex-col flex-grow',
          commonClass,
          contentClass,
          leftGapClass,
          { ':soy: overflow-y-auto': isContentScroll }
        ]"
      >
        <slot></slot>
      </main>

      <!-- 底部 -->
      <template v-if="showFooter">
        <footer
          v-show="!fullContent"
          :class="[
            style['layout-footer'],
            ':soy: flex-shrink-0',
            commonClass,
            footerClass,
            footerLeftGapClass,
            { ':soy: absolute left-0 bottom-0 w-full': fixedFooter }
          ]"
        >
          <slot name="footer"></slot>
        </footer>
        <div
          v-show="!fullContent && fixedFooter"
          :class="[style['layout-footer-placement'], ':soy: flex-shrink-0 overflow-hidden']"
        ></div>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, watch, ref } from 'vue';
import type { LayoutProps } from './types';
import {
  LAYOUT_SCROLL_EL_ID,
  LAYOUT_MAX_Z_INDEX,
  createLayoutCssVars,
  useDragHelper,
  updateLayoutCssVars,
  LAYOUR_SIDER_WIDTH
} from './shared';
import style from './index.module.css';

import { parseCssValueToNumberFn } from '../../shared';

defineOptions({
  name: 'AdminLayout'
});

const props = withDefaults(defineProps<LayoutProps>(), {
  mode: 'vertical',
  isMobile: false,
  scrollMode: 'content',
  scrollElId: LAYOUT_SCROLL_EL_ID,
  commonClass: 'transition-all-300',
  fixedTop: true,
  maxZIndex: LAYOUT_MAX_Z_INDEX,
  headerVisible: true,
  headerHeight: 56,
  tabVisible: true,
  tabHeight: 48,
  siderVisible: true,
  siderCollapse: false,
  siderWidth: LAYOUR_SIDER_WIDTH,
  siderCollapsedWidth: 64,
  footerVisible: true,
  footerHeight: 48,
  rightFooter: false,
  siderDrag: true
});
const { targetViewWidthRef, startResizeFn, isResizingRef } = useDragHelper(props.siderWidth);

interface Emits {
  /** 点击移动端模式下的蒙层 */
  (e: 'click-mobile-sider-mask'): void;
  (e: 'update:siderWidth', siderWidth: number): void;
  (e: 'update:siderCollapse', siderCollapse: boolean): void;
}

const emit = defineEmits<Emits>();

type SlotFn = (props?: Record<string, unknown>) => any;

type Slots = {
  /** 插槽：主体 */
  default?: SlotFn;
  /** 插槽：头部 */
  header?: SlotFn;
  /** 插槽：页签 */
  tab?: SlotFn;
  /** 插槽：侧边栏 */
  sider?: SlotFn;
  /** 插槽：底部 */
  footer?: SlotFn;
};
const slots = defineSlots<Slots>();

const cssVarsObjInnder = createLayoutCssVars(props);
const siderWidthRef = computed({
  get: () => {
    return props.siderWidth;
  },
  set: nV => {
    emit('update:siderWidth', nV);
  }
});
// const siderCollapseRef = ref(props.siderCollapse);
const siderCollapseRef = computed({
  set: nV => {
    emit('update:siderCollapse', nV);
  },
  get: () => {
    return props.siderCollapse;
  }
});
/** CSS 变量 */
const cssVars = computed(() => cssVarsObjInnder);

// 各部分的可见性
const showHeader = computed(() => Boolean(slots.header) && props.headerVisible);
const showTab = computed(() => Boolean(slots.tab) && props.tabVisible);
const showSider = computed(() => !props.isMobile && Boolean(slots.sider) && props.siderVisible);
const showMobileSider = computed(() => props.isMobile && Boolean(slots.sider) && props.siderVisible);
const showFooter = computed(() => Boolean(slots.footer) && props.footerVisible);

// 滚动模式
const isWrapperScroll = computed(() => props.scrollMode === 'wrapper');
const isContentScroll = computed(() => props.scrollMode === 'content');

// 布局模式：水平、垂直
const isVertical = computed(() => props.mode === 'vertical');
const isHorizontal = computed(() => props.mode === 'horizontal');

/** 固定头部和页签 */
const fixedHeaderAndTab = computed(() => props.fixedTop || (isHorizontal.value && isWrapperScroll.value));

// class样式

const leftGapClass = computed(() => {
  if (!props.fullContent && showSider.value) {
    return props.siderCollapse ? style['left-gap_collapsed'] : style['left-gap'];
  }

  return '';
});

const headerLeftGapClass = computed(() => (isVertical.value ? leftGapClass.value : ''));

const footerLeftGapClass = computed(() => {
  const condition1 = isVertical.value;
  const condition2 = isHorizontal.value && isWrapperScroll.value && !props.fixedFooter;
  const condition3 = Boolean(isHorizontal.value && props.rightFooter);

  if (condition1 || condition2 || condition3) {
    return leftGapClass.value;
  }

  return '';
});

const siderPaddingClass = computed(() => {
  let cls = '';

  if (showHeader.value && !headerLeftGapClass.value) {
    cls += style['sider-padding-top'];
  }
  if (showFooter.value && !footerLeftGapClass.value) {
    cls += ` ${style['sider-padding-bottom']}`;
  }

  return cls;
});

function handleClickMask() {
  console.log('handleClickMask');
  emit('click-mobile-sider-mask');
}

// #region drag about
watch(
  () => targetViewWidthRef.value,
  nV => {
    // console.log('watch width', nV);
    if (nV <= (parseCssValueToNumberFn(cssVars.value['--soy-sider-collapsed-width']!) || 80)) {
      siderWidthRef.value = LAYOUR_SIDER_WIDTH;
      targetViewWidthRef.value = LAYOUR_SIDER_WIDTH;
      siderCollapseRef.value = true;
      // nV = defaultSiderWidth;
      updateLayoutCssVars(cssVarsObjInnder, '--soy-sider-width', `${siderWidthRef.value}px`);
      // emit('update:siderCollapse', siderCollapseRef.value);
      // emit('update:siderWidth', siderWidthRef.value);
    } else {
      siderWidthRef.value = nV;
      updateLayoutCssVars(cssVarsObjInnder, '--soy-sider-width', `${siderWidthRef.value}px`);
      // emit('update:siderWidth', siderWidthRef.value);
    }
    // console.log('cssVars', cssVars.value);
  }
);
// #endregion
</script>

<style scoped>
.drag-handle {
  position: absolute;
  right: 0;
  top: 0;
  width: 5px;
  height: 100%;
  cursor: ew-resize;
}

.resize-line {
  position: relative;
  top: 0;
  bottom: 0;
  right: 0;
  width: 2px;
  height: 100%;
  background-color: blue;
}
</style>
