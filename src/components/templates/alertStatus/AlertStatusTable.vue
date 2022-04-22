<template>
  <table-container type="basic" :height="alertStatusData.length > 4 ? '210px' : ''" :class="{'empty': alertStatusData.length === 0}">
    <caption>Alert 현황</caption>
    <colgroup>
      <col :style="`width: ${thWidth}%; min-width: 400px;`">
      <col v-for="(n, i) in tableData" :key="i"
           :style="`width: ${getColWidth(Object.keys(tableData).length)}%; min-width: 120px;`"
      >
    </colgroup>
    <thead>
      <tr>
        <th scope="col" class="alert-status__header">
          <span class="alert-status__title">Data Source 명</span>
          <span class="alert-status__title">Project 분류</span>
        </th>
        <th v-for="(n, i) in tableData" :key="i" scope="col">
          {{ n.name }}
        </th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="(data, idx) in alertStatusData" :key="idx">
        <th scope="row" class="alert-status__header">
          <span class="alert-status__title" :title="data.prometheusName">{{ data.prometheusName }}</span>
          <span class="alert-status__title" :title="data.groupName">{{ data.groupName }}</span>
        </th>
        <td v-for="(n, i) in tableData" :key="i">
          <button class="cnt" :class="{'on': data.resourceList[n.searchType]}" :disabled="!data.resourceList[n.searchType]"
                  @click="clickUnit(data, n.searchType)"
          >
            {{ data.resourceList[n.searchType] || 0 }}
          </button>
        </td>
      </tr>
      <tr v-if="alertStatusData.length === 0">
        <td>
          &nbsp;
        </td>
      </tr>
    </tbody>
  </table-container>
</template>

<script lang="ts">
import {
  defineComponent, reactive, toRefs,
} from '@vue/composition-api';
import { TableContainer } from '@/components/modules/table';

export default defineComponent({
  name: 'AlertStatusTable',
  components: {
    TableContainer,
  },
  props: {
    alertStatusData: {
      type: Array,
      default: () => [],
    },
    tableData: {
      type: Object,
      default: () => {},
    },
    statusType: { // 0 발생 , 1 해제 , 2 모니터링
      type: Number,
      default: 0,
    },
  },
  setup(props, { emit }) {
    const state = reactive({
      thWidth: 25,
    });

    const getColWidth = (cnt) => {
      const remain = 100 - state.thWidth;
      return (remain / cnt).toFixed(2);
    };

    const clickUnit = (data, type) => {
      const newData = {
        ...data,
        thresholdResourceType: type,
        groupJobName: data.groupName,
      };
      delete newData.groupName;

      emit('callback', newData);
    };

    return {
      ...toRefs(state),
      getColWidth,
      clickUnit,
    };
  },
});
</script>

<style scoped>
.alert-status__header {
  overflow: hidden;
  position: sticky;
  left: 0;
  z-index: 5;
  display: flex;
  align-items: center;
  justify-content: space-around;
}
.tbl.basic tbody .alert-status__header {
  background-color: #fff;
}
.alert-status__title {
  flex: 1;
  width: 50%;
  max-width: 200px;
  padding-left: 1rem;
}
.tbl.basic.empty::after {
  position: absolute;
  top: 50px;
  right: 0;
  left: 0;
  text-align: center;
  font-family: 'KBFGTextL';
  font-size: 14px;
  color: var(--gray);
  content: 'Data가 없습니다.';
}
.tbl.basic .cnt {
  padding: 0 0.5rem;
  height: 1.25rem;
  font-size: 12px;
  line-height: 1.5rem;
  border-radius: 1rem;
}
.tbl.basic .cnt.on {
  color: #1e9feb;
  background: aliceblue;
}
</style>
