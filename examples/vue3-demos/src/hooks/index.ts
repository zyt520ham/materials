/*
 * @Description: 
 * @Author: Gavin
 * @Date: 2023-08-10 16:05:08
 * @LastEditors: Gavin
 * @LastEditTime: 2023-08-10 16:05:14
 * @FilePath: /soybean-materials/examples/vue3-demos/src/hooks/index.ts
 */
import { ref } from 'vue-demi';

export function useBoolean(initValue = false) {
  const bool = ref(initValue);

  function setBool(value: boolean) {
    bool.value = value;
  }
  function setTrue() {
    setBool(true);
  }
  function setFalse() {
    setBool(false);
  }
  function toggle() {
    setBool(!bool.value);
  }

  return {
    bool,
    setBool,
    setTrue,
    setFalse,
    toggle
  };
}