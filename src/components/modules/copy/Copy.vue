<template>
  <div class="copy-wrapper"
       @mouseover="checkMouseEvent" @mouseleave="checkMouseEvent"
       @click.prevent="copyToClipboard"
  >
    <input type="hidden" :value="content">
    <slot />
    <button v-show="visible" class="btn-copy">
      <i class="fi fi-rr-copy" />
      <span class="hide">복사</span>
    </button>
  </div>
</template>

<script lang="ts">
import {
  reactive, toRefs,
} from '@vue/composition-api';

export default {
  name: 'Copy',
  props: {
    content: {
      type: String,
      default: '',
    },
  },
  setup() {
    const state = reactive({
      visible: false,
      mouseEvent: false,
    });

    const checkMouseEvent = (e:Event):void => {
      if (!state.mouseEvent) return;
      if (e.type === 'mouseover') {
        state.visible = true;
      } else {
        state.visible = false;
      }
    };

    const copyToClipboard = (e:Event):void => {
      const inp = (e.currentTarget as HTMLElement).firstChild as HTMLInputElement;
      inp.setAttribute('type', 'text');
      try {
        inp.select();
        const copy = document.execCommand('copy');
        if (!copy) {
          throw new Error('copied nothing');
        }
        alert('복사되었습니다.');
      } catch (err) {
        console.error(err);
      }
      inp.setAttribute('type', 'hidden');
    };

    return {
      ...toRefs(state),
      checkMouseEvent,
      copyToClipboard,
    };
  },
};
</script>

<style scoped>
.copy-wrapper {
  position: relative;
}
.copy-wrapper:active {
  color: #fff;
  background-color: var(--KB-gray);
}
.btn-copy {
  position: absolute;
  top: -2px;
  right: 0;
  width: 1rem;
  background-color: #fff;
}
.btn-copy .fi {
  font-size: 11px;
  color: #a0aec0;
}
</style>
