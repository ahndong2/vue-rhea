<template>
  <table-container type="data" :height="eventListData.length < 10 ? '' : '567px'">
    <caption>발생/해제 Event</caption>
    <thead>
      <tr>
        <th v-if="checkBox" scope="col" />
        <th scope="col">
          <span>Organization</span>
        </th>
        <th scope="col">
          <span>Prometheus</span>
        </th>
        <th scope="col">
          <span>Group&amp;Job</span>
        </th>
        <th scope="col">
          <span>발생 자원</span>
        </th>
        <th scope="col">
          <span>발생 시간</span>
        </th>
        <th v-if="statusType === 1" scope="col">
          <span>해제 시간</span>
        </th>
        <th scope="col">
          <span>Event type</span>
        </th>
        <th scope="col">
          <span>Alert 레벨</span>
        </th>
        <th scope="col">
          <span>Event 설명</span>
        </th>
        <th v-if="isValid('csp')" scope="col">
          <span>CSP</span>
        </th>
      </tr>
    </thead>
    <tbody>
      <tr v-if="eventListData.length === 0">
        <td colspan="10" class="empty">
          Event가 없습니다.
        </td>
      </tr>
      <tr v-for="(data,idx) in eventListData" :key="idx">
        <td v-if="checkBox" class="has-chk">
          <input :id="data.id" type="radio" name="radio" :checked="data.id === pickedID"
                 @change="selectCheckbox(data)"
          >
          <label :for="data.id" class="chk-item" />
        </td>
        <td class="org">
          <span class="text" :title="data.orgNm">{{ data.orgNm }}</span>
        </td>
        <td class="prom">
          <span class="text" :title="data.prometheusNm"><router-link :to="{ name: 'Monitoring', query: {org: data.organizaionId, prom: data.prometheusId}}" replace class="link">{{ data.prometheusNm }}</router-link></span>
        </td>
        <td class="group">
          <span class="text" :title="data.groupInfoNm">{{ data.groupInfoNm }}</span>
        </td>
        <td>
          <span :title="`${data.resourceType}(${data.resourceVal})`">
            {{ data.resourceType }}({{ data.resourceVal }})
          </span>
        </td>
        <td>
          <span>{{ data.registDate }}</span>
        </td>
        <td v-if="statusType === 1">
          <span>{{ data.recoveryDate }}</span>
        </td>
        <td>
          <span>{{ data.errorType }}</span>
        </td>
        <td>
          <span>{{ data.alertLevel | changeAlertStr }}</span>
        </td>
        <td>
          <span :title="data.errorDescription">{{ data.errorDescription }}</span>
        </td>
        <td v-if="isValid('csp')">
          <span>{{ data.csp }}</span>
        </td>
      </tr>
    </tbody>
  </table-container>
</template>

<script lang="ts">
import {
  computed,
  defineComponent,
  reactive,
  toRefs,
} from '@vue/composition-api';
import { TableContainer } from '@/components';
import { SELECT_OPTIONS } from '@/views/event/constants';
import { EventLog } from '@/store/type';

interface Props {
  eventListData: Array<EventLog>;
  checkBox?: boolean;
}
export default defineComponent({
  name: 'EventListTable',
  components: {
    TableContainer,
  },
  props: {
    eventListData: {
      type: Array,
      default: () => [],
    },
    checkBox: {
      type: Boolean,
      default: false,
    },
    statusType: {
      type: Number,
      default: 0,
    },
  },
  filters: {
    changeAlertStr: (value) => {
      const { ALERT_LEVEL } = SELECT_OPTIONS;
      const alert = ALERT_LEVEL.find((a) => a.value === Number(value));
      return alert?.label;
    },
  },
  setup(props:Props, { emit }) {
    // state
    const state = reactive({
      eventList: computed(() => props.eventListData),
      pickedID: '',
    });

    const selectCheckbox = (data) => {
      state.pickedID = data.id;
      emit('select', data.id);
    };

    const isValid = (attr) => {
      const arr = state.eventList;
      const hasValue = (el) => el[attr];
      return arr.some(hasValue);
    };

    return {
      ...toRefs(state),
      selectCheckbox,
      isValid,
    };
  },
});
</script>

<style scoped>
td.org .text {max-width: 100px;}
td.prom .text {max-width: 100px;}
td.group .text {max-width: 100px;}
</style>
