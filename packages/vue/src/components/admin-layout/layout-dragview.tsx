import { computed, defineComponent } from 'vue-demi';
import './layout.dragview.css';

const DragView = defineComponent({
  name: 'DragView',
  props: {
    leftWidth: {
      type: Number,
      default: 0
    }
  } as const,
  setup(props) {
    const getDragBarStyle = computed(() => {
      if (props.leftWidth > 0) {
        return {
          left: `${props.leftWidth}px`
        };
      }
      return {};
    });
    return () => <div class={['drag-bar-view']} style={getDragBarStyle}></div>;
  }
});
export default DragView;
