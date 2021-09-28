<template>
  <div>
    {data}
  </div>
</template>

<script lang="ts">
import {
  defineComponent, reactive, toRefs,
} from '@vue/composition-api';

export default defineComponent({
  name: 'IgnoreTable',
  components: {
  },
  setup(props, { emit }) {
    // state
    const state = reactive({
    });

    return {
      ...toRefs(state),
    };
  },
});
</script>

<style scoped>
</style>
