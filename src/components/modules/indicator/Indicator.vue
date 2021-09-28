<template>
  <li class="indicator"
      @mouseover="checkMouseEvent" @mouseleave="checkMouseEvent"
  >
    <transition name="fade">
      <div v-show="proxyVisible" class="tooltip">
        <div class="tooltip-content">
          {{ content }}
        </div>
      </div>
    </transition>
  </li>
</template>

<script lang="ts">
import { reactive, toRefs } from '@vue/composition-api';

interface Props {
  content?: string;
  mouseEvent?: boolean;
  visible?: boolean;
}
export default {
  name: 'Indicator',
  props: {
    content: {
      type: String,
      default: '',
    },
    mouseEvent: {
      type: Boolean,
      default: true,
    },
    visible: {
      type: Boolean,
      default: false,
    },
  },

  setup(props: Props) {
    const state = reactive({
      proxyVisible: props.visible,
    });

    const checkMouseEvent = (e) => {
      if (!props.mouseEvent) return;
      if (e.type === 'mouseover') {
        state.proxyVisible = true;
      } else {
        state.proxyVisible = false;
      }
    };
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
  top: calc(100% - 5px);
  left: calc(100% - 5px);
}

.tooltip-content {
  min-width: 100px;
  padding: 10px 15px;
  font-size: 15px;
  letter-spacing: 0.5px;
  color: #333;
  text-align: left;
  white-space: nowrap;
  background: #fff;
  border: 1px solid #ccc;
  border-radius: 6px;
  box-shadow: 1px 1px 3px rgba(0,0,0,.2);
}
</style>
