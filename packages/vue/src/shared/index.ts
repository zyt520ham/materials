/*
 * @Description:
 * @Author: Gavin
 * @Date: 2023-08-10 15:54:54
 * @LastEditors: Gavin
 * @LastEditTime: 2023-08-11 13:15:22
 * @FilePath: /soybean-materials/packages/vue/src/shared/index.ts
 */
import type { App, Component } from 'vue';
import { colord, extend } from 'colord';
import type { RgbColor } from 'colord';
import mixPlugin from 'colord/plugins/mix';

extend([mixPlugin]);

/** 注册组件 */
export function install<T extends Component>(app: App, component: T) {
  app.component(component.name!, component);
}

/**
 * 给颜色加透明度
 * @param color - 颜色
 * @param alpha - 透明度(0 - 1)
 */
export function addColorAlpha(color: string, alpha: number) {
  return colord(color).alpha(alpha).toHex();
}

/**
 * 颜色混合
 * @param firstColor - 第一个颜色
 * @param secondColor - 第二个颜色
 * @param ratio - 第二个颜色占比
 */
export function mixColor(firstColor: string, secondColor: string, ratio: number) {
  return colord(firstColor).mix(secondColor, ratio).toHex();
}

/**
 * 将带有透明度的颜色转换成相近的没有透明度的颜色
 * @param color - 颜色
 * @param alpha - 透明度(0 - 1)
 * @param bgColor 背景颜色(一般是白色或者黑色)
 */
export function transformColorWithOpacity(color: string, alpha: number, bgColor = '#ffffff') {
  const originColor = addColorAlpha(color, alpha);
  const { r: oR, g: oG, b: oB } = colord(originColor).toRgb();

  const { r: bgR, g: bgG, b: bgB } = colord(bgColor).toRgb();

  function calRgb(or: number, bg: number, al: number) {
    return bg + (or - bg) * al;
  }

  const resultRgb: RgbColor = {
    r: calRgb(oR, bgR, alpha),
    g: calRgb(oG, bgG, alpha),
    b: calRgb(oB, bgB, alpha)
  };

  return colord(resultRgb).toHex();
}

export function parseCssValueToNumberFn(cssValue: string | number): number {
  if (isNumber(cssValue)) {
    return cssValue;
  }
  return Number((cssValue as string).replace('px', ''));
}

function isNumber(val: unknown): val is number {
  return Object.prototype.toString.call(val) === '[object Number]';
}
