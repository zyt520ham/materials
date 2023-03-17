import type { KebabCase } from '../../types';
import type { LayoutProps } from './types';

type Prefix = '--soy-';

export type CssVarsProps = Pick<
  LayoutProps,
  'headerHeight' | 'tabHeight' | 'siderWidth' | 'siderCollapsedWidth' | 'footerHeight'
> & {
  headerZIndex?: number;
  tabZIndex?: number;
  siderZIndex?: number;
  footerZIndex?: number;
};

export type CssVars = {
  [K in keyof CssVarsProps as `${Prefix}${KebabCase<K>}`]: string | number;
};

export function createCssVars(props: CssVarsProps) {
  const cssVars: CssVars = {
    '--soy-header-height': `${props.headerHeight}px`,
    '--soy-header-z-index': props.headerZIndex,
    '--soy-tab-height': `${props.tabHeight}px`,
    '--soy-tab-z-index': props.tabZIndex,
    '--soy-sider-width': `${props.siderWidth}px`,
    '--soy-sider-collapsed-width': `${props.siderCollapsedWidth}px`,
    '--soy-sider-z-index': props.siderZIndex,
    '--soy-footer-height': `${props.footerHeight}px`,
    '--soy-footer-z-index': props.footerZIndex
  };

  return cssVars;
}

export function updateCssVars(vCssVars: CssVars, vProps: Partial<CssVarsProps>) {
  const enters = Object.entries(vProps);
  if (enters.length > 0) {
    enters.map(([kk, vv]) => {
      if (vv) {
        const key: keyof CssVars = `${'--soy-'}${getKebabCase(kk)}` as keyof CssVars;
        vCssVars[key] = key.includes('z-index') ? Number(`${vv}`) : `${vv}px`;
      }
      return [kk, vv];
    });
    return vCssVars;
  }
  console.warn('not update property');
  return vCssVars;
}

function getKebabCase(str: string) {
  const arr = str.split('');
  // 使用循环遍历字符串
  const strArr = arr.map(item => {
    if (item.toUpperCase() === item) {
      return `-${item.toLowerCase()}`;
    }
    return item;
  });
  return strArr.join('');
}
