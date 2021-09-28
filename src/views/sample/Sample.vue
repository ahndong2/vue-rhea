<template>
  <div>
    {data}
  </div>
</template>

<script lang="ts">
import {
  defineComponent, watch, reactive, toRefs, onMounted,
} from '@vue/composition-api';
import { getInstance } from '@/composable';

interface Props {
  sample?: string;
}

export default defineComponent({
  name: 'Sample',
  components: {
  },
  setup(props: Props, { emit }) {
    const { instance } = getInstance();
    console.log(instance, props);

    // state
    const state = reactive({
      data: '',
    });

    watch(() => state.data, (value) => {
      console.log('watch : ', value);
      emit('event');
    });

    onMounted(() => {
      state.data = 'Sample';
    });

    return {
      ...toRefs(state),
    };
  },
});
</script>

<style scoped>
</style>
