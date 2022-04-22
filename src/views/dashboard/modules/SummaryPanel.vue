<template>
  <div class="summary-panel">
    <dl v-for="(data,idx) in summaryDataList" :key="idx"
        :class="data.label | changeAlertCls"
        class="item"
        @click="clickSummary(data)"
    >
      <dd class="count">
        {{ data.count }}
      </dd>
      <dt class="text">
        {{ data.label }}
      </dt>
    </dl>
  </div>
</template>

<script lang="ts">
import {
  defineComponent, reactive, toRefs, computed,
} from '@vue/composition-api';
import { SummaryTypeArray } from '@/views/dashboard/type';
import { SELECT_OPTIONS } from '@/views/dashboard/constants';
import router from '@/router';

export default defineComponent({
  name: 'SummaryPanel',
  props: {
    summaryData: {
      type: Array,
      default: () => [],
    },
  },
  filters: {
    changeAlertCls: (label):string|number|undefined => {
      const { ALERT_LEVEL } = SELECT_OPTIONS;
      const alert = ALERT_LEVEL.find((item) => item.label === label);
      return alert?.class;
    },
  },
  setup(props: SummaryTypeArray) {
    const state = reactive({
      summaryDataList: computed(() => props.summaryData),
    });

    const clickSummary = (data):void => {
      if (data.label === '해제') {
        router.push({ name: 'Event', params: { tabKey: 'Unresolved' } });
      } else {
        router.push({ name: 'Event', params: { tabKey: 'Occurred' } });
      }
    };

    return {
      ...toRefs(state),
      clickSummary,
    };
  },
});
</script>

<style>
.summary-panel {
  display: flex;
  flex-direction: row;
  align-items: center;
  height: 100%;
  cursor: pointer;
}
.summary-panel .item {
  position: relative;
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  height: 100%;
  text-align: center;
}
.summary-panel .resolved {color: #48bb78;}
.summary-panel .caution {color: #fece00;}
.summary-panel .warning {color: #ff9b51;}
.summary-panel .danger {color: #ff5555;}
.summary-panel .unresolved {color: var(--KB-gold);}
.summary-panel .count {
  font-weight: bold;
  font-size: 2rem;
}
.summary-panel .text {
  padding-top: 10px;
  font-family: 'KBFGTextL';
  color: var(--KB-silver);
}
.summary-panel .item.caution::after,
.summary-panel .item.warning::after,
.summary-panel .item.danger::after {
  position: absolute;
  left: 100%;
  top: 35%;
  display: flex;
  width: 20px;
  height: 20px;
  margin-left: -10px;
  align-items: center;
  justify-content: center;
  font-family: sans-serif;
  font-size: 1.5rem;
  color: #ddd;
  border-color: currentColor;
  border-radius: 10px;
  content: ' ';
}
.summary-panel .item.caution::after,
.summary-panel .item.warning::after {
  content: '+';
}
.summary-panel .item.danger::after {
  content: '=';
}
.summary-panel .item.resolved::after {
  position: absolute;
  right: 0;
  width: 1px;
  height: 50%;
  background-color: #eee;
  content: ' ';
}
</style>
