/*
 * @Description:
 * @Author: Gavin
 * @Date: 2023-08-10 15:54:54
 * @LastEditors: Gavin
 * @LastEditTime: 2023-08-11 13:17:20
 * @FilePath: /soybean-materials/packages/vue/src/libs/admin-layout/shared.ts
 */
import { ref } from 'vue-demi';
import type { KebabCase } from '../../types';
import type { LayoutProps } from './types';

/** 布局组件的滚动元素id默认值 */
export const LAYOUT_SCROLL_EL_ID = '__SCROLL_EL_ID__';

/**
 * @deprecated 请使用 LAYOUT_SCROLL_EL_ID
 */
export const SCROLL_EL_ID = LAYOUT_SCROLL_EL_ID;

/** 最大的zIndex值 */
export const LAYOUT_MAX_Z_INDEX = 100;

export const LAYOUR_SIDER_WIDTH = 220;
type Prefix = '--soy-';

type CssVarsProps = Pick<
  LayoutProps,
  'headerHeight' | 'tabHeight' | 'siderWidth' | 'siderCollapsedWidth' | 'footerHeight'
> & {
  headerZIndex?: number;
  tabZIndex?: number;
  siderZIndex?: number;
  mobileSiderZIndex?: number;
  footerZIndex?: number;
};

type CssVars = {
  [K in keyof CssVarsProps as `${Prefix}${KebabCase<K>}`]: string | number;
};

function createCssVars(props: CssVarsProps) {
  const cssVars: CssVars = {
    '--soy-header-height': `${props.headerHeight}px`,
    '--soy-header-z-index': props.headerZIndex,
    '--soy-tab-height': `${props.tabHeight}px`,
    '--soy-tab-z-index': props.tabZIndex,
    '--soy-sider-width': `${props.siderWidth}px`,
    '--soy-sider-collapsed-width': `${props.siderCollapsedWidth}px`,
    '--soy-sider-z-index': props.siderZIndex,
    '--soy-mobile-sider-z-index': props.mobileSiderZIndex,
    '--soy-footer-height': `${props.footerHeight}px`,
    '--soy-footer-z-index': props.footerZIndex
  };

  return cssVars;
}
export function updateLayoutCssVars(target: CssVars, key: keyof CssVars, value: string) {
  if (target[key]) {
    target[key] = value;
  }
}
export function createLayoutCssVars(props: LayoutProps) {
  const {
    mode,
    isMobile,
    maxZIndex = LAYOUT_MAX_Z_INDEX,
    headerHeight,
    tabHeight,
    siderWidth,
    siderCollapsedWidth,
    footerHeight
  } = props;

  const headerZIndex = maxZIndex - 3;
  const tabZIndex = maxZIndex - 5;
  const siderZIndex = mode === 'vertical' || isMobile ? maxZIndex - 1 : maxZIndex - 4;
  const mobileSiderZIndex = isMobile ? maxZIndex - 2 : 0;
  const footerZIndex = maxZIndex - 5;

  const cssProps: CssVarsProps = {
    headerHeight,
    headerZIndex,
    tabHeight,
    tabZIndex,
    siderWidth,
    siderZIndex,
    mobileSiderZIndex,
    siderCollapsedWidth,
    footerHeight,
    footerZIndex
  };

  return createCssVars(cssProps);
}

export function useDragHelper(vTargetOriWidth: number) {
  const targetViewWidthRef = ref(vTargetOriWidth);
  const isResizing = ref(false);
  const resize = (event: MouseEvent) => {
    if (!isResizing.value) return;
    targetViewWidthRef.value = event.clientX;
  };

  const stopResize = () => {
    isResizing.value = false;
    document.removeEventListener('mousemove', resize);
    document.removeEventListener('mouseup', stopResize);
  };

  const startResizeFn = (event: MouseEvent) => {
    isResizing.value = true;
    document.addEventListener('mousemove', resize);
    document.addEventListener('mouseup', stopResize);
  };
  const setTargetWidthFn = (setValue: number) => {
    targetViewWidthRef.value = setValue;
  };
  return { startResizeFn, targetViewWidthRef, setTargetWidthFn, isResizingRef: isResizing };
}
