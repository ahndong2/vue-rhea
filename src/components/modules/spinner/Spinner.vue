<template>
  <pulse-loader :loading="spinner" :color="color" :size="size" :margin="margin" />
</template>

<script>
import {
  reactive, toRefs, computed,
} from '@vue/composition-api';
import PulseLoader from 'vue-spinner/src/PulseLoader.vue';
import { getInstance } from '@/composable';

export default {
  name: 'Spinner',
  components: {
    PulseLoader,
  },
  setup() {
    const { instance } = getInstance();
    const state = reactive({
      spinner: computed(() => instance.$store.state.global.spinner),
      color: 'var(--KB-negative)',
      size: '15px',
      margin: '5px',
    });
    return {
      ...toRefs(state),
    };
  },
};
</script>

<style>
.v-spinner {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 150;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.3);
}
</style>
