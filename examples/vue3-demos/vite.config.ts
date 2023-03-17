import { defineConfig } from 'vite';
import { fileURLToPath } from 'url';
import vue from '@vitejs/plugin-vue';
import vueJsx from '@vitejs/plugin-vue-jsx';
import VueMacros from 'unplugin-vue-macros/vite';
import unocss from '@unocss/vite';
import { NaiveUiResolver } from 'unplugin-vue-components/resolvers';
import Components from 'unplugin-vue-components/vite';
// import * as path from 'path';

export default defineConfig({
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
      // '@soybeanjs/vue-materials': path.resolve(__dirname, '../../packages/vue/src/index'),
      // '@soybeanjs/vue-materials/dist/style.css': path.resolve(
      //   __dirname,
      //   '../../packages/vue/src/components/admin-layout/layout.module.css'
      // )
    }
  },
  plugins: [
    vue(),
    vueJsx(),
    VueMacros(),
    unocss(),
    Components({
      dts: 'src/typings/components.d.ts',
      resolvers: [NaiveUiResolver()]
    })
  ],
  server: {
    host: '0.0.0.0',
    port: 3900
  }
});
