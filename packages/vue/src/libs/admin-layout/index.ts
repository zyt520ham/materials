/*
 * @Description:
 * @Author: Gavin
 * @Date: 2023-08-10 15:54:54
 * @LastEditors: Gavin
 * @LastEditTime: 2023-08-11 18:06:33
 * @FilePath: /soybean-materials/packages/vue/src/libs/admin-layout/index.ts
 */
import AdminLayout from './index.vue';
import { install } from '../../shared';
import { LAYOUT_SCROLL_EL_ID, LAYOUT_MAX_Z_INDEX } from './shared';

AdminLayout.install = install;

export { AdminLayout, LAYOUT_SCROLL_EL_ID, LAYOUT_MAX_Z_INDEX };

export type { LayoutProps, LayoutMode, ScrollMode } from './types';
