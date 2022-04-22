<template>
  <span :class="level | changeAlertCls" class="level-item">
    <span class="circle" />
    <span class="text pl-1">{{ level | changeAlertStr }}</span>
  </span>
</template>

<script lang="ts">
import {
  defineComponent,
  reactive,
  toRefs,
} from '@vue/composition-api';
import { SELECT_OPTIONS } from '@/views/event/constants';

export default defineComponent({
  name: 'AlertLevel',
  props: {
    level: { // 1 주의 , 2 경고 , 3 심각
      type: String,
      default: '',
    },
  },
  filters: {
    changeAlertStr: (value):string|number|undefined => {
      const { ALERT_LEVEL } = SELECT_OPTIONS;
      const alert = ALERT_LEVEL.find((item) => item.value === Number(value));
      return alert?.label;
    },
    changeAlertCls: (value):string|number|undefined => {
      const { ALERT_LEVEL } = SELECT_OPTIONS;
      const alert = ALERT_LEVEL.find((item) => item.value === Number(value));
      return alert?.class;
    },
  },
  setup() {
    const state = reactive({
    });
    return {
      ...toRefs(state),
    };
  },
});
</script>

<style scoped>
.level-item {
  position: relative;
  display: inline-flex;
  vertical-align: top;
  align-items: center;
  justify-content: center;
}
.level-item .circle {
  display: inline-block;
  width: 7px;
  height: 7px;
  border-radius: 50%;
}
.level-item.resolved .circle {
  background-color: #bbb;
}
.level-item.caution .circle {
  background-color: #fece00;
}
.level-item.warning .circle {
  background-color: #ff9b51;
}
.level-item.danger .circle {
  background-color: #ff5555;
}
</style>
