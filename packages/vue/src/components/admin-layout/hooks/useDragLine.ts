import type { Component, ComputedRef, Ref } from 'vue-demi';
import { nextTick, onMounted, unref } from 'vue-demi';
import { useDebounceFn } from '@vueuse/core';
// eslint-disable-next-line max-params
export function useDragLine(
  siderRef: Ref<any>,
  dragBarRef: Ref<any>,
  props: ComputedRef<{
    collapsedWidth?: number;
  }>,
  dragFinishCb?: (width: number) => void
) {
  const getMiniWidthNumber = props.value.collapsedWidth;

  const setMenuSetting = (params: any) => {
    console.log('setMenuSetting', params);

    if (params.menuWidth > 0) {
      // eslint-disable-next-line no-unused-expressions
      dragFinishCb && dragFinishCb(params.menuWidth);
      // dragWidth.value = params.menuWidth;
    } else {
      // eslint-disable-next-line no-unused-expressions
      dragFinishCb && dragFinishCb(getMiniWidthNumber!);
      // dragWidth.value = getMiniWidthNumber;
    }
  };
  onMounted(() => {
    nextTick(() => {
      const exec = useDebounceFn(changeWrapWidth, 80);
      exec();
    });
  });

  function getEl(elRef: Ref<Element | Component>): any {
    const el = unref(elRef);
    // debugger
    if (!el) return null;
    if (Reflect.has(el, '$el')) {
      return (unref(elRef) as any)?.$el;
    }
    if (Reflect.has(el, '$contentEl')) {
      return (unref(elRef) as any)?.$contentEl;
    }
    return unref(elRef);
  }

  function handleMouseMove(ele: HTMLElement, wrap: HTMLElement, clientX: number) {
    console.log('handleMouseMove');
    document.onmousemove = innerE => {
      let iT: number = (ele as any).left + (innerE.clientX - clientX);
      // innerE = innerE || window.event;
      const maxT = 800;
      const minT = getMiniWidthNumber!;
      // eslint-disable-next-line no-unused-expressions
      iT < 0 && (iT = 0);
      // eslint-disable-next-line no-unused-expressions
      iT > maxT && (iT = maxT);
      // eslint-disable-next-line no-unused-expressions
      iT < minT && (iT = minT);
      // eslint-disable-next-line no-unused-expressions,no-multi-assign
      ele.style.left = wrap.style.width = `${iT}px`;
      return false;
    };
  }

  // Drag and drop in the menu area-release the mouse
  function removeMouseup(ele: any) {
    const wrap = getEl(siderRef);
    document.onmouseup = () => {
      document.onmousemove = null;
      document.onmouseup = null;
      wrap.style.transition = 'width 0.2s';
      const width = parseInt(wrap.style.width, 10);
      setMenuSetting({ menuWidth: width });
      // 将内置样式移除
      wrap.style = {};

      ele.releaseCapture?.();
    };
  }

  function changeWrapWidth() {
    console.log('changeWrapWidth');
    const ele = getEl(dragBarRef);

    const wrap = getEl(siderRef);
    if (!wrap) return;

    ele.onmousedown = (e: any) => {
      wrap.style.transition = 'unset';
      const clientX = e?.clientX;
      ele.left = ele.offsetLeft;
      handleMouseMove(ele, wrap, clientX);
      removeMouseup(ele);
      ele.setCapture?.();
      return false;
    };
  }

  return {};
}
