<template>
  <div class="summary">
    <template v-if="summaryDataList.length !== 0">
      <dl v-for="(data,idx) in summaryDataList" :key="idx" :class="'status' + idx" @click="clickSummary(data)">
        <dd class="count">
          {{ data.count }}
        </dd>
        <dt class="text">
          {{ data.label }}
        </dt>
      </dl>
    </template>
    <template v-else>
      <dl class="status0">
        <dd class="count">
          0
        </dd>
        <dd class="text">
          심각
        </dd>
      </dl>
      <dl class="status1">
        <dd class="count">
          0
        </dd>
        <dd class="text">
          경고
        </dd>
      </dl>
      <dl class="status2">
        <dd class="count">
          0
        </dd>
        <dd class="text">
          주의
        </dd>
      </dl>
      <dl class="status3">
        <dd class="count">
          0
        </dd>
        <dd class="text">
          해제
        </dd>
      </dl>
      <dl class="status4">
        <dd class="count">
          0
        </dd>
        <dd class="text">
          미해제
        </dd>
      </dl>
    </template>
  </div>
</template>

<script lang="ts">
import {
  defineComponent, reactive, toRefs, computed,
} from '@vue/composition-api';
import { SummaryTypeArray } from '@/views/dashboard/type';
import router from '@/router';

export default defineComponent({
  name: 'SummaryPanel',
  components: {
  },
  props: {
    summaryData: {
      type: Array,
      default: () => [],
    },
  },
  setup(props: SummaryTypeArray) {
    // state
    const state = reactive({
      summaryDataList: computed(() => props.summaryData),
    });

    const clickSummary = (data) => {
      if (data.label === '해제') {
        router.push({ path: '/vue/event', query: { tabKey: 'Unresolved' } });
      } else {
        router.push({ path: '/vue/event', query: { tabKey: 'Occurred' } });
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
.alert-status .summary {
  display: flex;
  flex-direction: row;
  align-items: center;
  height: 100%;
  cursor: pointer;
}
.alert-status .summary > dl {
  position: relative;
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  height: 100%;
  text-align: center;
}

.alert-status .summary .status0 {
  color: #fece00;
  /* color: rgb(141 116 74 / 60%); */
}
.alert-status .summary .status1 {
  color: #ff9b51;
  /* color: rgb(141 116 74 / 80%); */
}
.alert-status .summary .status2 {
  color: #ff5555;
  /* color: rgb(141 116 74 / 100%); */
}
.alert-status .summary .status4 {
  color: #757575;
  /* color: #e53e3e; */
  color: var(--KB-gold);
}
.alert-status .summary .status3 {
  order: -1;
  color: #48bb78;
}
.alert-status .summary .count {
  font-weight: 700;
  font-size: 2rem;
}
.alert-status .summary .text {
  padding-top: 10px;
  font-family: 'KBFGTextL';
  color: var(--KB-silver);
}

.alert-status .summary > dl::before {
  position: absolute;
  left: 0;
  top: 65px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: 'Spoqa Han Sans Neo', sans-serif;
  color: #ddd;
  border-color: currentColor;
  border-radius: 10px;
  content: ' ';
}
.alert-status .summary > dl.status1::before,
.alert-status .summary > dl.status2::before,
.alert-status .summary > dl.status4::before {
  width: 20px;
  height: 20px;
  margin-left: -10px;
  font-size: 22px;
}
.alert-status .summary > dl.status1::before,
.alert-status .summary > dl.status2::before {
  content: '+';
}
.alert-status .summary > dl.status4:not(:first-child)::before {
  content: '=';
}
.alert-status .summary > dl.status3::after {
  position: absolute;
  right: 0;
  width: 1px;
  height: 50%;
  background-color: #eee;
  content: ' ';
}
</style>
