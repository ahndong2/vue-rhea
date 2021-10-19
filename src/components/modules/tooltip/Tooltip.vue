<template>
  <transition name="fade">
    <div v-if="tooltipVisible" class="tooltip">
      <div class="tooltip-content" v-html="content" />
    </div>
  </transition>
</template>

<script lang="ts">
import { reactive, toRefs, watch } from '@vue/composition-api';

export default {
  name: 'Tooltip',
  props: {
    content: {
      type: String,
      default: '',
    },
    visible: {
      type: Boolean,
      default: false,
    },
  },
  setup(props) {
    const state = reactive({
      tooltipVisible: props.visible,
    });

    watch(() => props.visible, (newValue) => {
      state.tooltipVisible = newValue;
    });

    return {
      ...toRefs(state),
    };
  },
};
</script>

<style scoped>
.tooltip {
  position: absolute;
  z-index: 10;
  cursor: default;
  transition: opacity .3s ease;
}

.tooltip-content {
  width: 300px;
  padding: 12px 15px;
  font-size: 15px;
  color: #333;
  background: #fff;
  border: 1px solid #ccc;
  border-radius: 6px;
  box-shadow: 1px 1px 3px rgba(0,0,0,.2);
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
