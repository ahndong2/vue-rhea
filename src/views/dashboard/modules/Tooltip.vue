<template>
  <transition>
    <div v-if="visible" class="tooltip" :style="{ left: tooltipPosition.x + 'px', top: tooltipPosition.y + 'px' }">
      <p>{{ tooltipData }}</p>
      <button class="btn-close">
        툴팁 닫기
      </button>
    </div>
  </transition>
</template>

<script lang="ts">
import {
  defineComponent, reactive, toRefs, watch,
} from '@vue/composition-api';
import { getInstance } from '@/composable';

export default defineComponent({
  name: 'Tooltip',
  components: {
  },
  props: {
    tooltipData: {
      type: String,
      default: '',
    },
    tooltipPosition: {
      type: Object,
      default: null,
    },
  },
  setup(props) {
    const { instance } = getInstance();

    const state = reactive({
      visible: false,
    });

    watch(() => props.tooltipData, (value) => {
      state.visible = !!value;
    });

    return {
      ...toRefs(state),
    };
  },
});
</script>

<style scoped>
.tooltip {
  position: absolute;
  padding: 1rem;
  background: #eee;
  transition: opacity .3s ease;
}

.tooltip .btn-close {
  display: none;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity .3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
