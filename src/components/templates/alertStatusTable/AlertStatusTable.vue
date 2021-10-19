<template>
  <section id="alertStatus" class="alert-status">
    <h3 class="section-title">
      {{ statusType === 1 ? 'Alert 해제 현황' : 'Alert 현황' }}
    </h3>
    <div class="section-content">
      <table-container type="basic" :height="alertStatusData.length < 5 ? '' : '300px'">
        <caption>Alert 현황</caption>
        <colgroup>
          <col style="width: auto;">
          <col style="width: auto;">
          <col style="width: 10%;">
          <col style="width: 10%;">
          <col style="width: 10%;">
          <col style="width: 10%;">
          <col style="width: 10%;">
          <col style="width: 10%;">
          <col style="width: 10%;">
        </colgroup>
        <thead>
          <tr>
            <th scope="col">
              <span>Prometheus</span>
            </th>
            <th scope="col">
              <span>Group&amp;Jobs</span>
            </th>
            <th scope="col">
              <span>CPU</span>
            </th>
            <th scope="col">
              <span>Memory</span>
            </th>
            <th scope="col">
              <span>Storage</span>
            </th>
            <th scope="col">
              <span>Network<br>Reception</span>
            </th>
            <!-- <th scope="col">
              <span>NetworkSend</span>
            </th>
            <th scope="col">
              <span>SystemLoad</span>
            </th> -->
            <th scope="col">
              <span>Node</span>
            </th>
            <th scope="col">
              <span>Pod</span>
            </th>
            <th scope="col">
              <span>PodError</span>
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(data,idx) in alertStatusData" :key="idx" :class="statusType === 2 ? 'monitoring': ''">
            <th scope="row">
              {{ data.prometheusName }}
            </th>
            <th scope="row">
              {{ data.groupName }}
            </th>
            <td @click="callbackFunc('CPU')">
              {{ checkNull(data.resourceList.CPU) }}
            </td>
            <td @click="callbackFunc('Memory')">
              {{ checkNull(data.resourceList.Memory) }}
            </td>
            <td @click="callbackFunc('Storage')">
              {{ checkNull(data.resourceList.Storage) }}
            </td>
            <td @click="callbackFunc('NetworkReception')">
              {{ checkNull(data.resourceList.NetworkReception) }}
            </td>
            <!-- <td>
              {{ checkNull(data.resourceList.NetworkSend) }}
            </td>
            <td>
              {{ checkNull(data.resourceList.SystemLoad) }}
            </td> -->
            <td @click="callbackFunc('Node')">
              {{ checkNull(data.resourceList.Node) }}
            </td>
            <td @click="callbackFunc('Pod')">
              {{ checkNull(data.resourceList.Pod) }}
            </td>
            <td @click="callbackFunc('PodError')">
              {{ checkNull(data.resourceList.PodError) }}
            </td>
          </tr>
          <tr v-if="alertStatusData.length === 0">
            <td colspan="11" class="empty">
              Data가 없습니다.
            </td>
          </tr>
        </tbody>
      </table-container>
    </div>
  </section>
</template>

<script lang="ts">
import {
  defineComponent, reactive, toRefs,
} from '@vue/composition-api';
import { TableContainer } from '@/components/modules/table';

export default defineComponent({
  name: 'AlertCountTable',
  components: {
    TableContainer,
  },
  props: {
    alertStatusData: {
      type: Array,
      default: () => [],
    },
    statusType: { // 0 발생 , 1 해제 , 2 모니터링
      type: Number,
      default: 0,
    },
  },
  setup(props, { emit }) {
    const state = reactive({
    });

    const callbackFunc = (type) => {
      emit('callback', type);
    };

    const checkNull = (data) => (data || 0);
    return {
      ...toRefs(state),
      checkNull,
      callbackFunc,
    };
  },
});
</script>

<style scoped>
.monitoring td {
  cursor: pointer;
}
</style>
