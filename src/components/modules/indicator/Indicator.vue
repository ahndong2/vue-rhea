<template>
  <div class="indicator" :class="{'cursor-pointer': mouseEvent}"
       @mouseover="checkMouseEvent" @mouseleave="checkMouseEvent"
  >
    <transition name="fade">
      <div v-if="tooptipVisible" class="tooltip">
        <div class="tooltip-content">
          {{ tooltip }}
        </div>
      </div>
    </transition>
  </div>
</template>

<script lang="ts">
import { reactive, toRefs } from '@vue/composition-api';

interface Props {
  tooltip?: string;
  mouseEvent?: boolean;
  visible?: boolean;
}
export default {
  name: 'Indicator',
  props: {
    tooltip: {
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
      tooptipVisible: props.visible,
    });

    const checkMouseEvent = (e) => {
      if (!props.mouseEvent) return;
      if (e.type === 'mouseover') {
        state.tooptipVisible = true;
      } else {
        state.tooptipVisible = false;
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
.indicator {
  position: relative;
  height: 30px;
}
.dot-list .indicator {
  width: 30px;
}
.tbl .indicator {
  width: var(--indicator);
}
.indicator::before,
.indicator::after {
  display: block;
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  margin: auto;
  width: var(--indicator);
  height: var(--indicator);
  background-color: currentColor;
  border-radius: 50%;
  content: ' ';
}
.indicator::before {
  opacity: 0;
}
.dot-list .indicator[class*='text-red']::before {
  animation: halo 2s infinite both;
}
@keyframes halo {
  0% {
    opacity: 1;
    transform: scale(0);
  }
  100% {
    opacity: 0;
    transform: scale(3);
  }
}

/* tooltip */
.tooltip {
  position: absolute;
  z-index: 10;
  cursor: default;
  transition: opacity .3s ease;
  top: calc(100% - 5px);
  left: 50%;
  transform: translateX(-50%);
}
.tooltip::after {
  content: ' ';
  position: absolute;
  top: -3px;
  left: calc(50% - 4px);
  width: 7px;
  height: 7px;
  background-color: #fff;
  transform: rotate(45deg);
  border: 1px solid var(--lightgray);
  border-width: 1px 0px 0px 1px;
}
.tooltip-content {
  width: 200px;
  padding: 10px 15px;
  font-size: 14px;
  color: #333;
  text-align: left;
  background: #fff;
  border: 1px solid var(--lightgray);
  border-radius: 6px;
  box-shadow: 1px 1px 3px rgba(0,0,0,.2);
}
</style>
