  <template>
  <div class="h-full">
    <LayoutDemo />
  </div>
</template>

<script setup lang="ts">
import LayoutDemo from './layout-demo.vue';
// import TabDemo from './tab-demo.vue';
</script>

<style scoped></style>  

<!-- <template>
  <div id="app">
    <aside :style="{ width: asideWidth + 'px' }">
      Aside content
      <div class="drag-handle" @mousedown="startResize">
        <div
        class="resize-line"
        :style="{ display: isResizing ? 'block' : 'none' }"
      ></div>
      </div>

    </aside>
    <main>
      Main content
    </main>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';

export default defineComponent({
  name: 'App',
  setup() {
    const asideWidth = ref(200); // 初始宽度
    const isResizing = ref(true);

    const startResize = (event: MouseEvent) => {
      isResizing.value = true;
      document.addEventListener('mousemove', resize);
      document.addEventListener('mouseup', stopResize);
    };

    const resize = (event: MouseEvent) => {
      if (!isResizing.value) return;
      asideWidth.value = event.clientX;
    };

    const stopResize = () => {
      isResizing.value = false;
      document.removeEventListener('mousemove', resize);
      document.removeEventListener('mouseup', stopResize);
    };

    return {
      asideWidth,
      isResizing,
      startResize,

    };
  },
});
</script>

<style>
#app {
  display: flex;
  height: 100vh;
}

aside {
  background-color: #f0f0f0;
  position: relative;
}

.drag-handle {
  position: absolute;
  right: 0;
  top: 0;
  width: 1px;
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
  background-color: #000;
}
</style> -->
