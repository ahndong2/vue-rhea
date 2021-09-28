<template>
  <i class="ico">
    <img
      :src="require(`@/assets/icons/ic_${name}.svg`)"
      :style="`width: ${size}px;`"
      alt=""
    >
  </i>
</template>

<script lang="ts">
import { reactive, toRefs } from '@vue/composition-api';

export default {
  name: 'Icon',
  props: {
    name: {
      type: String,
      default: '',
    },
    size: {
      type: String,
      default: '24',
    },
  },
  setup() {
    const state = reactive({
      // route: computed(() => `@/assets/icons/ic_${props.name}.svg`),
    });

    return {
      ...toRefs(state),
    };
  },
};
</script>

<style scoped>
.ico {
  display: inline-flex;
  line-height: 1;
}
</style>
