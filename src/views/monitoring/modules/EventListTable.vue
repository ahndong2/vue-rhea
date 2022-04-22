<template>
  <table-container type="data" :height="eventListData.length > 10 ? '500px' : ''">
    <caption>이벤트 로그</caption>
    <!-- 발생 자원, 발생 일시, Alert 레벨, Event 설명 -->
    <colgroup>
      <col style="width: 35%;">
      <col style="width: 15%;">
      <col style="width: 7%;">
      <col style="width: auto;">
    </colgroup>
    <thead>
      <tr>
        <th scope="col">
          발생 자원
        </th>
        <th scope="col">
          발생 일시
        </th>
        <th scope="col">
          Alert 레벨
        </th>
        <th scope="col">
          Event 설명
        </th>
      </tr>
    </thead>
    <tbody>
      <tr v-if="eventListData.length === 0">
        <td colspan="20" class="empty">
          Data가 없습니다.
        </td>
      </tr>
      <tr v-for="(data,idx) in eventListData" :key="idx">
        <td>
          <span :title="data.resourceType | resourceName(data.resourceVal)">
            <span class="resource-type">{{ data.resourceType }}</span>
            <span v-if="data.resourceVal.trim()">{{ data.resourceVal }}</span>
          </span>
        </td>
        <td>
          <span>{{ data.registDate }}</span>
        </td>
        <td>
          <alert-level :level="data.alertLevel" />
        </td>
        <td>
          <span :title="data.errorDescription">{{ data.errorDescription }}</span>
        </td>
      </tr>
    </tbody>
  </table-container>
</template>

<script lang="ts">
import {
  defineComponent,
  reactive,
  toRefs,
} from '@vue/composition-api';
import { TableContainer, AlertLevel } from '@/components';

export default defineComponent({
  name: 'EventListTable',
  components: {
    TableContainer,
    AlertLevel,
  },
  props: {
    eventListData: {
      type: Array,
      default: () => [],
    },
  },
  filters: {
    resourceName: (t, v) => {
      const type = t;
      const value = v.trim();
      return value ? `${type}(${value})` : `${type}`;
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
