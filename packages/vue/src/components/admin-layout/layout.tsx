import { defineComponent, computed, ref, onMounted } from 'vue-demi';
import type { PropType } from 'vue-demi';
import { initProps, getStrategyResult } from '../../shared';
import { createCssVars, updateCssVars } from './css-vars';
import type { CssVars, CssVarsProps } from './css-vars';
import LayoutHeader from './layout-header';
import LayoutTab from './layout-tab';
import LayoutSider from './layout-sider';
import LayoutContent from './layout-content';
import LayoutFooter from './layout-footer';
import style from './layout.module.css';
import type { LayoutProps, LayoutMode, ScrollMode } from './types';

import LayoutDragview from './layout-dragview';
import { useDragLine } from './hooks/useDragLine';
/** 布局组件的滚动元素id默认值 */
const SCROLL_EL_ID = '__SCROLL_EL_ID__';

/** 最大的zIndex值 */
const MAX_Z_INDEX = 100;

/** 管理系统的布局组件 */
const AdminLayout = defineComponent<LayoutProps>({
  name: 'AdminLayout',
  props: initProps<LayoutProps>({
    mode: {
      type: String as PropType<LayoutMode>,
      default: 'vertical'
    },
    scrollMode: {
      type: String as PropType<ScrollMode>,
      default: 'content'
    },
    scrollElId: {
      type: String,
      default: SCROLL_EL_ID
    },
    scrollWrapperClass: {
      type: String,
      default: ''
    },
    commonClass: {
      type: String,
      default: 'transition-all-300'
    },
    fixedTop: {
      type: Boolean,
      default: true
    },
    maxZIndex: {
      type: Number,
      default: MAX_Z_INDEX
    },
    headerVisible: {
      type: Boolean,
      default: true
    },
    headerClass: {
      type: String,
      default: ''
    },
    headerHeight: {
      type: Number,
      default: 56
    },
    tabVisible: {
      type: Boolean,
      default: true
    },
    tabClass: {
      type: String,
      default: ''
    },
    tabHeight: {
      type: Number,
      default: 48
    },
    siderVisible: {
      type: Boolean,
      default: true
    },
    siderClass: {
      type: String,
      default: ''
    },
    siderCollapse: {
      type: Boolean,
      default: false
    },
    siderWidth: {
      type: Number,
      default: 220
    },
    siderCollapsedWidth: {
      type: Number,
      default: 64
    },
    contentClass: {
      type: String,
      default: ''
    },
    fullContent: {
      type: Boolean,
      default: false
    },
    footerVisible: {
      type: Boolean,
      default: true
    },
    footerClass: {
      type: String,
      default: ''
    },
    fixedFooter: {
      type: Boolean,
      default: true
    },
    footerHeight: {
      type: Number,
      default: 48
    },
    rightFooter: {
      type: Boolean,
      default: false
    }
  }),
  setup(props, { slots, emit }) {
    const getInitCssVars = () => {
      const {
        mode,
        maxZIndex = MAX_Z_INDEX,
        headerHeight,
        tabHeight,
        siderWidth,
        siderCollapsedWidth,
        footerHeight
      } = props;

      const headerZIndex = maxZIndex - 2;
      const tabZIndex = maxZIndex - 4;
      const siderZIndex = mode === 'vertical' ? maxZIndex - 1 : maxZIndex - 3;
      const footerZIndex = maxZIndex - 4;

      const cssProps: CssVarsProps = {
        headerHeight,
        headerZIndex,
        tabHeight,
        tabZIndex,
        siderWidth,
        siderZIndex,
        siderCollapsedWidth,
        footerHeight,
        footerZIndex
      };

      return createCssVars(cssProps);
    };
    const initVars = getInitCssVars();
    const cssVarsRef = ref<CssVars>(initVars);
    const cssVars = computed<CssVars>(() => {
      return cssVarsRef.value;
    });
    console.log('cssVars', cssVars);
    const isWrapperScroll = computed(() => props.scrollMode === 'wrapper');
    const isContentScroll = computed(() => props.scrollMode === 'content');

    const isVertical = computed(() => props.mode === 'vertical');
    const isHorizontal = computed(() => props.mode === 'horizontal');

    const fixedTop = computed(() => props.fixedTop || (isHorizontal.value && isWrapperScroll.value));

    const leftGapClass = computed(() => {
      const cls = getStrategyResult([
        [Boolean(props.siderVisible && !props.fullContent && props.siderCollapse), style['left-gap_collapsed']],
        [Boolean(props.siderVisible && !props.fullContent && !props.siderCollapse), style['left-gap']]
      ]);

      return cls || '';
    });

    const headerLeftGapClass = computed(() => (isVertical.value ? leftGapClass.value : ''));

    const footerLeftGapClass = computed(() => {
      const cls = getStrategyResult([
        [isVertical.value, leftGapClass.value],
        [isHorizontal.value && isWrapperScroll.value && !props.fixedFooter, leftGapClass.value],
        [Boolean(isHorizontal.value && props.rightFooter), leftGapClass.value]
      ]);

      return cls || '';
    });

    const siderPaddingClass = computed(() => {
      let cls = '';

      if (props.headerVisible && !headerLeftGapClass.value) {
        cls += style['sider-padding-top'];
      }
      if (props.footerVisible && !footerLeftGapClass.value) {
        cls += ` ${style['sider-padding-bottom']}`;
      }

      return cls;
    });

    const dragBarRef = ref();
    const siderRef = ref();
    useDragLine(
      siderRef,
      dragBarRef,
      computed(() => {
        return {
          collapse: props.siderCollapse
        };
      }),
      (vDragWith: number) => {
        // dragWidth.value = vDragWith;
        console.log('dragWidth', vDragWith);

        cssVarsRef.value = updateCssVars(cssVars.value, { siderWidth: vDragWith });
        console.log('cssVars', cssVars.value);
        // cssVars.value['--soy-sider-width'] = vDragWith;
        // emit('updateSiderWithEvent', vDragWith);
      }
    );

    onMounted(() => {
      console.log('layout onMounted', dragBarRef.value);
    });
    const tempSiderWidthRef = ref<number>(props.siderWidth || 0);
    const btnClick = () => {
      console.log('btnClick');
      tempSiderWidthRef.value += 5;
      cssVarsRef.value = updateCssVars(cssVars.value, { siderWidth: tempSiderWidthRef.value });
      console.log('cssVars', cssVars.value);
    };
    return () => (
      <div class={[':soy: relative h-full', props.commonClass]} style={{ ...cssVars.value }}>
        <div
          id={isWrapperScroll.value ? props.scrollElId : undefined}
          class={[
            ':soy: flex flex-col h-full',
            props.commonClass,
            props.scrollWrapperClass,
            { ':soy: overflow-y-auto': isWrapperScroll.value }
          ]}
        >
          <LayoutHeader
            visible={props.headerVisible}
            class={[props.commonClass, props.headerClass, headerLeftGapClass.value]}
            hide={props.fullContent}
            fixed={fixedTop.value}
          >
            {slots.header?.()}
          </LayoutHeader>
          <LayoutTab
            visible={props.tabVisible}
            class={[props.commonClass, props.tabClass, { 'top-0!': !props.headerVisible }, leftGapClass.value]}
            hide={props.fullContent}
            fixed={fixedTop.value}
          >
            {slots.tab?.()}
          </LayoutTab>
          <LayoutSider
            visible={props.siderVisible}
            class={[props.commonClass, props.siderClass, siderPaddingClass.value]}
            hide={props.fullContent}
            collapse={props.siderCollapse}
            ref={siderRef}
          >
            {slots.sider?.()}
            <LayoutDragview hide={props.siderCollapse} ref={dragBarRef} leftWidth={props.siderWidth} />
          </LayoutSider>

          <LayoutContent
            scrollId={props.scrollElId}
            overScroll={isContentScroll.value}
            class={[props.commonClass, props.contentClass, leftGapClass.value]}
          >
            <button onClick={btnClick}>addBtn</button>
            {/* {slots.default?.()} */}
          </LayoutContent>
          <LayoutFooter
            visible={props.footerVisible}
            class={[props.commonClass, props.footerClass, footerLeftGapClass.value]}
            hide={props.fullContent}
            fixed={props.fixedFooter}
          >
            {slots.footer?.()}
          </LayoutFooter>
        </div>
      </div>
    );
  }
});

export default AdminLayout;

export { SCROLL_EL_ID };
