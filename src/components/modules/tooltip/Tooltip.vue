<template>
  <transition name="fade">
    <div v-if="tooltipVisible" class="tooltip"
         @mouseenter="checkMouseEvent" @mouseleave="checkMouseEvent"
    >
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
  setup(props, { emit }) {
    const state = reactive({
      tooltipVisible: props.visible,
    });

    const checkMouseEvent = (e:Event):void => {
      emit('mouse', e);
    };

    watch(() => props.visible, (newValue) => {
      state.tooltipVisible = newValue;
    });

    return {
      ...toRefs(state),
      checkMouseEvent,
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
  position: relative;
  overflow: hidden;
  width: 300px;
  padding: 12px 15px;
  font-size: 14px;
  color: #333;
  background: #fff;
  border: 1px solid var(--lightgray);
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
