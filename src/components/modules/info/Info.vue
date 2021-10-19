<template>
  <div class="info-item" @mouseover="checkMouseEvent" @mouseleave="checkMouseEvent">
    <button type="button" class="btn-info" @click="toggleInfo">
      <i class="ic-info">i</i>
      <span v-if="title" class="tit">{{ title }}</span>
    </button>
    <transition name="fade">
      <div v-if="visible" class="info-layer" :class="dir">
        <div class="info-content">
          {{ content }}
          <slot />
        </div>
        <button v-if="!mouseEvent" type="button" class="info-close" @click="visible = false">
          <span class="hide">닫기</span>
        </button>
      </div>
    </transition>
  </div>
</template>

<script lang="ts">
import { reactive, toRefs } from '@vue/composition-api';

interface Props {
  content?: string;
  mouseEvent?: boolean;
}
export default {
  name: 'Info',
  props: {
    content: {
      type: String,
      default: '',
    },
    mouseEvent: {
      type: Boolean,
      default: false,
    },
    title: {
      type: String,
      default: '',
    },
    dir: {
      type: String,
      default: '',
    },
  },

  setup(props: Props) {
    const state = reactive({
      visible: false,
    });

    const toggleInfo = () => {
      state.visible = !state.visible;
    };

    const checkMouseEvent = (e) => {
      if (!props.mouseEvent) return;
      if (e.type === 'mouseover') {
        state.visible = true;
      } else {
        state.visible = false;
      }
    };
    return {
      ...toRefs(state),
      toggleInfo,
      checkMouseEvent,
    };
  },
};
</script>

<style scoped>
.info-item {
  position: relative;
  display: inline-block;
}
.btn-info {
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 24px;
  height: 24px;
  padding: 0 4px;
  text-align: center;
  cursor: help;
}
.ic-info {
  display: inline-block;
  width: 17px;
  height: 17px;
  font-size: 12px;
  line-height: 20px;
  text-align: center;
  color: var(--white);
  background: #a5a5a5;
  border-radius: 15px;
  opacity: .8;
}
.ic-info + .tit {
  margin-left: 8px;
  padding-top: 2px;
  white-space: nowrap;
}

.info-layer {
  overflow: hidden;
  position: absolute;
  top: 50%;
  left: calc( 100% + 8px );
  transform: translate(0,-50%);
  z-index: 100;
  background: #fff;
  border: 1px solid #ccc;
  border-radius: 6px;
  box-shadow: 1px 1px 3px rgba(0,0,0,.2);
  cursor: default;
}

.info-content {
  min-width: 200px;
  min-height: 40px;
  padding: 10px 15px;
  font-weight: 400;
  font-size: 15px;
  color: #333;
}
.info-close {
  position: absolute;
  right: 0;
  top: 0;
  width: 40px;
  height: 40px;
  background: no-repeat center;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24'%3E%3Cpath d='M0 0h24v24H0z' fill='none'/%3E%3Cpath d='M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z' fill='%23666'/%3E%3C/svg%3E");
}
</style>
