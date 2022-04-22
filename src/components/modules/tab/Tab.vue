<template>
  <div v-if="isActive">
    <slot />
  </div>
</template>

<script lang="ts">
import {
  defineComponent, reactive, toRefs, onMounted,
} from '@vue/composition-api';

export default defineComponent({
  name: 'Tab',
  props: {
    name: {
      type: String,
      default: '',
    },
    selected: {
      type: Boolean,
      default: false,
    },
    tabKey: {
      type: String,
      default: '',
    },
  },
  setup(props) {
    const state = reactive({
      isActive: false,
    });

    onMounted(() => {
      state.isActive = props.selected;
    });

    return {
      ...toRefs(state),
    };
  },
});
</script>
