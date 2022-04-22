<template>
  <table-container id="eventListTable" type="data" :height="eventListData.length > 10 ? '500px' : ''">
    <caption>이벤트 로그</caption>
    <thead>
      <tr>
        <th v-if="checkBox" scope="col" />
        <th scope="col" class="text-center">
          <span>상세</span>
        </th>
        <th scope="col" class="text-center">
          <span>상태</span>
        </th>
        <th scope="col">
          <span>Organization 명</span>
        </th>
        <th scope="col">
          <span>Data Source 명</span>
        </th>
        <th scope="col">
          <span>Project 분류</span>
        </th>
        <th scope="col">
          <span>발생 자원</span>
        </th>
        <th scope="col">
          <span>발생 일시</span>
        </th>
        <th v-if="statusType === 1" scope="col">
          <span>해제 일시</span>
        </th>
        <th scope="col">
          <span>Event Type</span>
        </th>
        <th scope="col">
          <span>Alert 레벨</span>
        </th>
        <th v-if="isValid('csp')" scope="col">
          <span>CSP</span>
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
        <td v-if="checkBox" class="chk-item">
          <input :id="data.key" type="radio" name="radio" class="inp" :checked="data.key === selectedId"
                 @change="selectCheckbox(data)"
          >
          <label :for="data.key" class="ico" />
        </td>
        <td class="text-center">
          <button class="btn detail" @click="openModalDetail(data)">
            <i class="fi fi-rr-zoom-in" />
            <span class="text">상세</span>
          </button>
        </td>
        <td class="text-center">
          <button class="btn status"
                  @click="openModalStatus(data)"
          >
            <span class="text">{{ data.status | changeStatusStr }}</span>
          </button>
        </td>
        <td>
          <span class="text clip" :title="data.orgNm">
            <span v-if="data.parentOrgName">{{ data.parentOrgName }}-</span>{{ data.orgNm }}
          </span>
        </td>
        <td>
          <span v-if="data.organizationId === 100" :title="data.prometheusNm" class="text clip">{{ data.prometheusNm }}</span>
          <router-link v-else
                       :to="{ name: 'Monitoring', params: {org: data.organizationId, prom: data.prometheusId, group: data.groupId}}"
                       :title="data.prometheusNm"
                       class="text clip"
          >
            {{ data.prometheusNm }}
          </router-link>
        </td>
        <td>
          <span class="text clip" :title="data.groupInfoNm">{{ data.groupInfoNm }}</span>
        </td>
        <td>
          <span :title="data.resourceType | resourceName(data.resourceVal)">
            <span class="resource-type">{{ data.resourceType }}</span>
            <span v-if="data.resourceVal.trim()">{{ data.resourceVal }}</span>
          </span>
        </td>
        <td>
          <span class="text">{{ data.registDate }} ~</span>
        </td>
        <td v-if="statusType === 1">
          <span class="text">{{ data.recoveryDate }}</span>
        </td>
        <td>
          <!-- [S] Event Type -->
          <template v-if="statusType === 0 && (
            data.thresholdResourceType === 'Pod' ||
            data.thresholdResourceType === 'PodError' ||
            data.thresholdResourceType === 'Job' ||
            data.thresholdResourceType === 'WebHook'
          )"
          >
            <span class="text" @mouseenter="showTooltip">
              {{ data.thresholdResourceType }}
              <i class="fi fi-rr-exclamation" />
            </span>
            <div class="tooltip">
              <em class="code">{{ data.thresholdResourceType }}</em> 은 &lsquo;해제&rsquo;로 변경 시<br>
              <u class="highlight">수동해제</u> 되어 <u class="highlight">해제 탭</u>으로 이동됩니다.
            </div>
          </template>
          <span v-else class="text">{{ data.thresholdResourceType }}</span>
          <!-- [E] Event Type -->
        </td>
        <td>
          <template v-if="statusType === 1">
            <alert-level :level="data.alertLevel" />
            <span class="text-xs">(max)</span>
          </template>
          <template v-else>
            <alert-level :level="data.alertLevel" />
            <div class="-mt-1">
              (max: <alert-level :level="data.maxLevel" />)
            </div>
          </template>
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
import { TableContainer, AlertLevel } from '@/components';
import { EventLog } from '@/store/type';
import { SELECT_OPTIONS } from '@/views/event/constants';

interface Props {
  eventListData: Array<EventLog>;
  checkBox?: boolean;
  statusType?: number;
}
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
    checkBox: {
      type: Boolean,
      default: false,
    },
    statusType: { // 0 발생 , 1 해제
      type: Number,
      default: 0,
    },
  },
  filters: {
    changeStatusStr: (value):string|undefined => {
      const { STATUS } = SELECT_OPTIONS;
      const status = STATUS.find((s) => s.value === value);
      return status?.label;
    },
    resourceName: (t, v) => {
      const type = t;
      const value = v.trim();
      return value ? `${type}(${value})` : `${type}`;
    },
  },
  setup(props:Props, { emit }) {
    const state = reactive({
      eventList: computed(() => props.eventListData),
      selectedId: '',
    });

    const selectCheckbox = (data):void => {
      state.selectedId = data.key;
      emit('select', state.selectedId);
    };

    const isValid = (attr):boolean => {
      const arr = state.eventList;
      const hasValue = (el) => el[attr];
      return arr.some(hasValue);
    };

    const openModalStatus = (data):void => {
      emit('openModalStatus', { ...data, statusType: props.statusType });
    };
    const openModalDetail = (data):void => {
      emit('openModalDetail', { ...data });
    };

    const showTooltip = (e:Event):void => {
      const target = e.target as HTMLElement;
      const tooltip = target.nextElementSibling as HTMLElement;
      const tbl = document.getElementById('eventListTable') as HTMLElement;

      const [targetT, targetL] = [Math.round(target.getBoundingClientRect().top), Math.round(target.getBoundingClientRect().left)];
      const [tblT, tblL] = [tbl.getBoundingClientRect().top, tbl.getBoundingClientRect().left];

      tooltip.style.top = `${targetT - tblT}px`;
      tooltip.style.left = `${targetL - tblL}px`;
    };

    return {
      ...toRefs(state),
      selectCheckbox,
      isValid,
      openModalStatus,
      openModalDetail,
      showTooltip,
    };
  },
});
</script>

<style scoped>
.tbl.data tbody td .clip {
  overflow: hidden;
  max-width: 130px;
}
.fi-rr-exclamation {
  position: static;
  padding: 2px 0 0 0.25rem;
  color: var(--gray);
}
.tooltip {
  display: none;
  position: absolute;
  z-index: 10;
  top: 0;
  left: 0;
  transform: translate(-25%,1.25rem);
  padding: 0.75rem 0.75rem 0.5rem;
  line-height: 1.5;
  color: #666;
  background-color: #fff;
  box-shadow: 1px 1px 3px rgba(0,0,0,.2);
}
.text:hover + .tooltip {
  display: block;
}
.level-item::v-deep {
  font-size: 12px;
}
</style>
