import { computed, defineComponent, onMounted, ref, getCurrentInstance } from 'vue-demi';
import './layout.dragview.css';

const DragView = defineComponent({
  name: 'DragView',
  props: {
    hide: {
      type: Boolean,
      default: true
    },
    leftWidth: {
      type: Number,
      default: 0
    }
  } as const,
  setup(props, { expose }) {
    const getDragBarStyle = computed(() => {
      if (props.leftWidth >= 0) {
        return {
          left: `${props.leftWidth}px`,
          'background-color': 'red'
        };
      }
      return {};
    });
    const contextEl = ref({});
    expose({
      contextEl
    });
    onMounted(() => {
      console.log('dragview onmounted', getCurrentInstance());
      contextEl.value = getCurrentInstance()?.vnode.el as any;
    });

    return () => <div v-show={!props.hide} class={['drag-bar-view']} style={{ ...getDragBarStyle.value }}></div>;
  }
});
export default DragView;
