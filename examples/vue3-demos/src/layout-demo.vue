<template>
  <admin-layout
    v-model:sider-collapse="siderCollapse"
    v-model:sider-width="siderNoCollapseWidthRef"
    :mode="layoutMode"
    :scroll-mode="scrollMode"
    :fixed-top="fixedTop"
    :header-visible="headerVisible"
    :tab-visible="tabVisible"
    :sider-visible="siderVisible"
    :full-content="fullWindowMain"
    :footer-visible="footerVisible"
    :fixed-footer="fixedFooter"
    :right-footer="rightFooter"
  >
    <template v-if="headerVisible" #header>
      <div class="h-full p-2px">
        <div :class="[{ 'use-opacity': useOpacity }]" class="card head-slot">Header插槽</div>
      </div>
    </template>
    <template #tab>
      <div class="h-full p-2px">
        <div :class="[{ 'use-opacity': useOpacity }]" class="card tab-slot">Tab插槽</div>
      </div>
    </template>
    <template #sider>
      <div class="h-full p-2px">
        <div :class="[{ 'use-opacity': useOpacity }]" class="card sider-slot">
          <div class="block">
            <div>Sider</div>
            <br />
            <div>侧边栏插槽</div>
          </div>
        </div>
      </div>
    </template>
    <template #footer>
      <div class="h-full p-2px">
        <div :class="[{ 'use-opacity': useOpacity }]" class="card foot-slot">Footer插槽</div>
      </div>
    </template>
    <template #default>
      <div class="p-2px card main-slot">
        <div class="w-full h-full">
          <div class="flex flex-row justify-between justify-items-center h-full">
            <div class="flex-none w-200px h-full content-center self-center p-2px main-inner">
              <div class="flex flex-col justify-center h-full text-center">
                <span class="justify-self-center">黄色区域为main区域</span>
              </div>
            </div>
            <div class="w-100px h-full overflow-auto text-center p-2px main-inner">
              <div v-for="i in 50" :key="i">{{ i }}</div>
            </div>
            <div class="flex-none w-250px text-center p-2px main-inner">
              <div class="flex flex-col justify-center h-full">
                <span class="justify-self-center">layout控制开关</span>
                <div>
                  <n-form-item label="布局方式" :show-feedback="false">
                    <div class="text-center w-full">
                      <n-radio-group v-model:value="layoutMode">
                        <n-space>
                          <n-radio v-for="mode in layoutModeList" :key="mode.value" :value="mode.value">
                            {{ mode.label }}
                          </n-radio>
                        </n-space>
                      </n-radio-group>
                    </div>
                  </n-form-item>
                  <n-form label-placement="left" label-width="auto">
                    <n-form-item label="是否显示Footer" :show-feedback="false">
                      <div class="text-center w-full">
                        <n-switch v-model:value="footerVisible"></n-switch>
                      </div>
                    </n-form-item>
                    <n-form-item label="是否显示Tab" :show-feedback="false">
                      <div class="text-center w-full">
                        <n-switch v-model:value="tabVisible"></n-switch>
                      </div>
                    </n-form-item>
                    <n-form-item label="是否显示Sider" :show-feedback="false">
                      <div class="text-center w-full">
                        <n-switch v-model:value="siderVisible"></n-switch>
                      </div>
                    </n-form-item>
                    <n-form-item label="fixedTop" :show-feedback="false">
                      <div class="text-center w-full">
                        <n-switch v-model:value="fixedTop"></n-switch>
                      </div>
                    </n-form-item>
                    <n-form-item label="fixedFooter" :show-feedback="false">
                      <div class="text-center w-full">
                        <n-switch v-model:value="fixedFooter"></n-switch>
                      </div>
                    </n-form-item>
                    <n-form-item label="sider折叠" :show-feedback="false">
                      <div class="text-center w-full">
                        <n-switch v-model:value="siderCollapse"></n-switch>
                      </div>
                    </n-form-item>
                    <n-form-item label="main slots全屏" :show-feedback="false">
                      <div class="text-center w-full">
                        <n-switch v-model:value="fullWindowMain">
                          <template #checked> 全屏 </template>
                          <template #unchecked> 取消全屏 </template>
                        </n-switch>
                      </div>
                    </n-form-item>
                    <n-form-item label="main 滚动方式" :show-feedback="false">
                      <div class="text-center w-full">
                        <n-radio-group v-model:value="scrollMode" name="radiogroup">
                          <n-space>
                            <n-radio v-for="mode in scrollModeList" :key="mode" :value="mode">
                              {{ mode }}
                            </n-radio>
                          </n-space>
                        </n-radio-group>
                      </div>
                    </n-form-item>
                    <n-form-item label="foot right" :show-feedback="false">
                      <div class="text-center w-full">
                        <n-switch v-model:value="rightFooter"> </n-switch>
                      </div>
                    </n-form-item>
                    <n-form-item label="是否开启半透明" :show-feedback="false">
                      <div class="text-center w-full">
                        <n-switch v-model:value="useOpacity"> </n-switch>
                      </div>
                    </n-form-item>
                    <n-form-item label="slder 拖拽" :show-feedback="false">
                      <div class="text-center w-full">
                        <n-switch v-model:value="useSlderDrag"> </n-switch>
                      </div>
                    </n-form-item>
                  </n-form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>
  </admin-layout>
  <div class="hidden fixed right-0 top-120px h-480px overflow-auto px-12px whitespace-nowrap">
    <div class="font-bold">layoutMode:</div>
    <div v-for="item in layoutModeList" :key="item">
      <span class="pr-8px">{{ item }}</span>
      <input
        type="radio"
        name="layoutMode"
        :value="item"
        :checked="item === layoutMode"
        class="cursor-pointer"
        @change="setLayoutMode(item)"
      />
    </div>
    <div class="font-bold">scrollMode:</div>
    <div v-for="item in scrollModeList" :key="item">
      <span class="pr-8px">{{ item }}</span>
      <input
        type="radio"
        name="scrollMode"
        :value="item"
        :checked="item === scrollMode"
        class="cursor-pointer"
        @change="setScrollMode(item)"
      />
    </div>
    <div class="pt-24px">
      <span class="pr-8px">headerVisible</span>
      <input class="cursor-pointer" type="checkbox" :checked="headerVisible" @change="toggleHeaderVisible" />
    </div>
    <div class="pt-24px">
      <span class="pr-8px">tabVisible</span>
      <input class="cursor-pointer" type="checkbox" :checked="tabVisible" @change="toggleTabVisible" />
    </div>
    <div class="pt-24px">
      <span class="pr-8px">siderVisible</span>
      <input class="cursor-pointer" type="checkbox" :checked="siderVisible" @change="toggleSiderVisible" />
    </div>
    <div class="pt-24px">
      <span class="pr-8px">footerVisible</span>
      <input class="cursor-pointer" type="checkbox" :checked="footerVisible" @change="toggleFooterVisible" />
    </div>
    <div class="pt-24px">
      <span class="pr-8px">fixedTop</span>
      <input class="cursor-pointer" type="checkbox" :checked="fixedTop" @change="togglefixedTop" />
    </div>
    <div class="pt-24px">
      <span class="pr-8px">fixedFooter</span>
      <input class="cursor-pointer" type="checkbox" :checked="fixedFooter" @change="toggleFixedFooter" />
    </div>
    <div class="pt-24px">
      <span class="pr-8px">siderCollapse</span>
      <input class="cursor-pointer" type="checkbox" :checked="siderCollapse" @change="toggleSiderCollapse" />
    </div>
    <div class="pt-24px">
      <span class="pr-8px">rightFooter</span>
      <input class="cursor-pointer" type="checkbox" :checked="rightFooter" @change="toggleRightFooter" />
    </div>
    <div class="pt-24px">
      <span class="pr-8px">full content</span>
      <input class="cursor-pointer" type="checkbox" :checked="full" @change="toggleFull" />
    </div>
    <div class="pt-24px">
      <button @click="scrollEl">滚动</button>
    </div>
  </div>
  <!-- </div> -->
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useBoolean } from './hooks';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { AdminLayout, SCROLL_EL_ID } from '@soybeanjs/vue-materials';
import type { LayoutMode, ScrollMode } from '@soybeanjs/vue-materials';

const layoutMode = ref<LayoutMode>('vertical');
const layoutModeList: { label: string; value: LayoutMode }[] = [
  {
    label: '水平',
    value: 'horizontal'
  },
  {
    label: '竖直',
    value: 'vertical'
  }
];
function setLayoutMode(value: LayoutMode) {
  layoutMode.value = value;
}

const scrollMode = ref<ScrollMode>('wrapper');
const scrollModeList: ScrollMode[] = ['wrapper', 'content'];
function setScrollMode(value: ScrollMode) {
  scrollMode.value = value;
}

const { bool: headerVisible, toggle: toggleHeaderVisible } = useBoolean(true);
const { bool: tabVisible, toggle: toggleTabVisible } = useBoolean(true);
const { bool: siderVisible, toggle: toggleSiderVisible } = useBoolean(true);
const { bool: footerVisible, toggle: toggleFooterVisible } = useBoolean(true);
const { bool: fixedTop, toggle: togglefixedTop } = useBoolean(true);
const { bool: fixedFooter, toggle: toggleFixedFooter } = useBoolean(true);
const { bool: siderCollapse, toggle: toggleSiderCollapse } = useBoolean(true);
const { bool: rightFooter, toggle: toggleRightFooter } = useBoolean();
const { bool: fullWindowMain, toggle: toggleFull } = useBoolean();
const { bool: useOpacity } = useBoolean(true);
const { bool: useSlderDrag } = useBoolean(true);
const siderNoCollapseWidthRef = ref(240);
function scrollEl() {
  const dom = document.querySelector(`#${SCROLL_EL_ID}`);
  dom?.scrollTo({ top: 100, behavior: 'smooth' });
}
</script>

<style scoped>
.head-slot {
  @apply b-1px b-solid b-#34fa37 bg-#34fa37;
}
.tab-slot {
  @apply b-1px b-solid b-#fa8734 bg-#E06F1EFF;
}
.sider-slot {
  @apply b-1px b-solid b-#34ccfa bg-#34ccfa;
}
.foot-slot {
  @apply b-1px b-solid b-#34fa37 bg-#34fa37;
}
.main-slot {
  @apply b-1px b-solid b-#DDE34AFF bg-#DDE34AFF;
}
.main-inner {
  @apply b-1px b-solid b-#EAC508FF bg-#EAC508FF  rd-4px;
}
.card {
  @apply flex-center h-full   rd-4px;
}
.use-opacity {
  @apply bg-opacity-20%;
}
</style>
