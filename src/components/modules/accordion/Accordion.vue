<template>
  <div />
</template>

<script lang="ts">
import { reactive, toRefs } from '@vue/composition-api';

interface Props {
  content?: string;
}
export default {
  name: 'Info',
  props: {
    content: {
      type: String,
      default: '',
    },
  },

  setup(props: Props) {
    const state = reactive({
      visible: false,
    });

    return {
      ...toRefs(state),
    };
  },
};
</script>

<style scoped>
</style>
