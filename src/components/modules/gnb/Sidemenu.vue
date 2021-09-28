<template>
  <aside class="sidemenu">
    <router-link to="/dashboard1" class="block mb-3">1</router-link>
    <router-link to="/dashboard2" class="block mb-3">2</router-link>
    <router-link to="/dashboard3" class="block mb-3">3</router-link>
  </aside>
</template>

<script lang="ts">
import { defineComponent, reactive, toRefs } from '@vue/composition-api';

export default defineComponent({
  name: 'Sidemenu',
  props: {
    ns: {
      type: String,
      default: 'default',
    },
    namespaceList: {
      type: Array,
      default: () => [],
    },
    refreshTime: {
      type: Number,
      default: 0,
    },
  },
  setup() {
    // state
    const state = reactive({
    });

    return {
      ...toRefs(state),
    };
  },
});
</script>

<style>
.sidemenu {
  position: fixed;
  top: var(--gnb-height);
  left: 0;
  bottom: 0;
  width: var(--side-width);
  padding-top: 10px;
  text-align: center;
  color: #ffffff;
  background-color: #333333;
}
</style>
