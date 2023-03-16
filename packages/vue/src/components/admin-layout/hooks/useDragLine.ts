import type { Component, ComputedRef, Ref } from 'vue-demi';
import { nextTick, onMounted, unref } from 'vue-demi';
import type { SiderProps } from '@/components/admin-layout/types';
import { useDebounceFn } from '@vueuse/core';
export function useDragLine(
  siderRef: Ref<any>,
  dragBarRef: Ref<any>,
  props: ComputedRef<Required<SiderProps>>,
  dragFinishCb?: (width: number) => void,
  mix = false
) {
  const getMiniWidthNumber = 80;
  const getCollapsed = props.value.collapse;

  const setMenuSetting = (params: any) => {
    console.log('setMenuSetting', params);

    if (params.menuWidth > 0) {
      dragFinishCb && dragFinishCb(params.menuWidth);
      // dragWidth.value = params.menuWidth;
    } else {
      dragFinishCb && dragFinishCb(getMiniWidthNumber);
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
    if (!el) return null;
    if (Reflect.has(el, '$el')) {
      return (unref(elRef) as Component)?.$el;
    }
    if (Reflect.has(el, '$contentEl')) {
      return (unref(elRef) as Component)?.$contentEl;
    }
    return unref(elRef);
  }

  function handleMouseMove(ele: HTMLElement, wrap: HTMLElement, clientX: number) {
    console.log('handleMouseMove');
    document.onmousemove = innerE => {
      let iT = (ele as any).left + (innerE.clientX - clientX);
      innerE = innerE || window.event;
      const maxT = 800;
      const minT = unref(getMiniWidthNumber);
      iT < 0 && (iT = 0);
      iT > maxT && (iT = maxT);
      iT < minT && (iT = minT);
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
      const width = parseInt(wrap.style.width);

      if (!mix) {
        const miniWidth = unref(getMiniWidthNumber);
        if (!unref(getCollapsed)) {
          width > miniWidth + 20 ? setMenuSetting({ menuWidth: width }) : setMenuSetting({ collapsed: true });
        } else {
          width > miniWidth && setMenuSetting({ collapsed: false, menuWidth: width });
        }
      } else {
        setMenuSetting({ menuWidth: width });
      }

      ele.releaseCapture?.();
    };
  }

  function changeWrapWidth() {
    const ele = getEl(dragBarRef);
    if (!ele) return;
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
