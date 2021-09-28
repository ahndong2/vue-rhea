<template>
  <div class="dashboard p-5 pr-0">
    <slot />
  </div>
</template>

<script lang="ts">
import {
  defineComponent,
} from '@vue/composition-api';

export default defineComponent({
  name: 'DefaultLayout',
  components: {
  },
});
</script>

<style scoped>
</style>
