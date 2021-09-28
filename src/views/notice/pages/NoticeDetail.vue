<template>
  <div>
    상세
  </div>
</template>

<script lang="ts">
import {
  reactive, toRefs, onMounted, computed, watch,
} from '@vue/composition-api';

export default {
  name: 'NoticeDetail',
  components: {},
  setup() {
    const state = reactive({
      data: null,
    });

    return {
      ...toRefs(state),
    };
  },
};
</script>

<style>

</style>
