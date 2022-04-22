<template>
  <modal :id="id" :visible="proxyVisible" size="lg" @closeModal="closeModal">
    <template #header>
      <h3>{{ statusType === 0 ? '발생' : statusType === 1 ? '해제' : '예외' }} Event 상세 조회</h3>
    </template>

    <template #body>
      <div class="info-tbl mb-4">
        <div class="flex flex-wrap">
          <dl>
            <dt class="tit">
              Organization
            </dt>
            <dd class="con">
              <span v-if="data.parentOrgName">{{ data.parentOrgName }}-</span>{{ data.organizationName }}
            </dd>
          </dl>
          <dl>
            <dt class="tit">
              Data Source
            </dt>
            <dd class="con">
              {{ data.prometheusName }}
            </dd>
          </dl>
          <dl>
            <dt class="tit">
              Project 분류
            </dt>
            <dd class="con">
              {{ data.groupName }}
            </dd>
          </dl>
          <dl>
            <dt class="tit">
              Event Type
            </dt>
            <dd class="con">
              {{ data.thresholdResourceType }}
            </dd>
          </dl>
          <dl v-if="resourceYN">
            <dt class="tit">
              발생 자원
            </dt>
            <dd v-if="data.resourceType || data.resourceVal" class="con">
              <span class="resource-type">{{ data.resourceType }}</span>
              <span v-if="data.resourceVal.trim()">{{ data.resourceVal }}</span>
            </dd>
          </dl>
        </div>
      </div>
      <tabs :tab-list="tabList" :active-idx="activeIdx" class="tab-event__detail" @change="tabChange">
        <template #Detail-body>
          <search-result :page="data.page" :size="data.size" :total="data.totalCount" class="mb-3" />
          <table-container type="data" :height="eventListData.length > 10 ? '500px' : ''">
            <caption>이벤트 로그</caption>
            <!-- 0 발생 : 발생 일시, Alert 레벨, Event 설명 -->
            <colgroup v-if="proxyType === 0 && resourceYN">
              <col style="width: 25%;">
              <col style="width: 15%;">
              <col style="width: auto;">
            </colgroup>
            <!-- 1 해제 : 발생 일시, 해제 일시, Alert 레벨, Event 설명 -->
            <colgroup v-if="proxyType === 1 && resourceYN">
              <col style="width: 20%;">
              <col style="width: 20%;">
              <col style="width: 13%;">
              <col style="width: auto;">
            </colgroup>
            <!-- 2 예외 : 발생 자원, 발생 일시, Alert 레벨, Event 설명 -->
            <colgroup v-if="proxyType === 2">
              <col style="width: 30%;">
              <col style="width: 15%;">
              <col style="width: 10%;">
              <col style="width: auto;">
            </colgroup>
            <!-- 0 발생(alert) : 발생 자원, 발생 일시, Alert 레벨, Event 설명 -->
            <colgroup v-if="proxyType === 0 && !resourceYN">
              <col style="width: 25%;">
              <col style="width: 20%;">
              <col style="width: 10%;">
              <col style="width: auto;">
            </colgroup>
            <!-- 1 해제(alert) : 발생 자원, 발생 일시, 해제 일시, Alert 레벨, Event 설명 -->
            <colgroup v-if="proxyType === 1 && !resourceYN">
              <col style="width: 20%;">
              <col style="width: 15%;">
              <col style="width: 15%;">
              <col style="width: 10%;">
              <col style="width: auto;">
            </colgroup>
            <thead>
              <tr>
                <th v-if="!resourceYN" scope="col">
                  발생 자원
                </th>
                <th scope="col">
                  발생 일시
                </th>
                <th v-if="proxyType === 1" scope="col">
                  해제 일시
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
              <tr v-for="(log,idx) in eventListData" :key="idx">
                <td v-if="!resourceYN">
                  <span class="resource-type">{{ log.resourceType }}</span>
                  <span v-if="log.resourceVal.trim()">{{ log.resourceVal }}</span>
                </td>
                <td>
                  <span>{{ log.registDate }}</span>
                </td>
                <td v-if="proxyType === 1">
                  <span>{{ log.recoveryDate }}</span>
                </td>
                <td>
                  <alert-level :level="log.alertLevel" />
                </td>
                <td>
                  <span class="whitespace-normal" :title="log.errorDescription">{{ log.errorDescription }}</span>
                </td>
              </tr>
            </tbody>
          </table-container>
          <pagination :current-page="data.page" :total-items="data.totalCount"
                      :items-per-page="data.size" :max-size="5" class="mt-6"
                      @change="changeDetailPage"
          />
        </template>
        <template #Alarm-body>
          <table-container type="data" :height="eventListData.length > 10 ? '500px' : ''">
            <caption>알림 대상자</caption>
            <colgroup>
              <col style="width: 16%;">
              <col style="width: 16%;">
              <col style="width: auto;">
              <col style="width: auto;">
              <col style="width: 20%;">
              <col style="width: 16%;">
            </colgroup>
            <thead>
              <tr>
                <th scope="col">
                  Alert 레벨
                </th>
                <th scope="col">
                  수신 그룹 명
                </th>
                <th scope="col">
                  수신자
                </th>
                <th scope="col">
                  사번
                </th>
                <th scope="col">
                  이메일
                </th>
                <th scope="col">
                  핸드폰 번호
                </th>
              </tr>
            </thead>
            <tbody>
              <tr v-if="alarmListData.length === 0">
                <td colspan="6" class="empty">
                  Data가 없습니다.
                </td>
              </tr>
              <tr v-for="(alarm,idx) in alarmListData" :key="idx" :class="{odd : alarm.groupNameCount%2 === 1}">
                <td>
                  <alert-level :level="alarm.alertLevel" />
                </td>
                <td>
                  <span>{{ alarm.groupName }}</span>
                </td>
                <td>
                  <span>{{ alarm.receptionNames }}</span>
                </td>
                <td>
                  <span>{{ alarm.pressureOfBusiness }}</span>
                </td>
                <td>
                  <span>{{ alarm.email }}</span>
                </td>
                <td>
                  <span>{{ alarm.phoneNumber }}</span>
                </td>
              </tr>
            </tbody>
          </table-container>
        </template>
      </tabs>
    </template>
  </modal>
</template>

<script lang="ts">
import {
  defineComponent, reactive, toRefs, computed,
} from '@vue/composition-api';
import { getInstance } from '@/composable';
import {
  Modal, Tabs, TableContainer, Pagination, AlertLevel, SearchResult,
} from '@/components';
import { EVENT_DETAIL_TAB } from '../constants';

interface SearchParam {
  groupId?: number | null;
  thresholdResourceType?:string;
  resourceType?:string;
  resourceVal?:string;
  recoveryDate?:string;
  searchType?: string;
  page?:number;
  totalCount?:number;
  size?:number;
  from?:string;
}

interface Props {
  id?:string;
  visible?:boolean;
  statusType?:number;
}

const defaultDetailData = {
  organizationId: null,
  organizationName: '',
  prometheusId: null,
  prometheusName: '',
  groupId: null,
  groupName: '',
  thresholdResourceType: '',
  resourceType: '',
  resourceVal: '',
  recoveryDate: '',
  page: 1,
  totalCount: 0,
  size: 10,
};

export default defineComponent({
  name: 'EventModalDetail',
  components: {
    Modal,
    Tabs,
    TableContainer,
    Pagination,
    AlertLevel,
    SearchResult,
  },
  props: {
    id: {
      type: String,
      default: '',
    },
    visible: {
      type: Boolean,
      default: false,
    },
    statusType: { // 0 발생 , 1 해제 , 2 예외
      type: Number,
      default: 0,
    },
  },
  setup(props: Props) {
    const { instance } = getInstance();
    const state = reactive({
      tabList: EVENT_DETAIL_TAB,
      activeIdx: 0,
      proxyVisible: props.visible,
      data: defaultDetailData,
      eventListData: [],
      proxyType: props.statusType,
      resourceYN: computed(() => Boolean(state.data.resourceType || state.data.resourceVal)),
      occurred: computed(() => instance.$store.state.event.occurred),
      unresolved: computed(() => instance.$store.state.event.unresolved),
      alarmListData: [],
    });

    const getFromDate = (type) => {
      const data = type === 0 ? state.occurred : state.unresolved;
      const { searchDuring } = data;
      if (searchDuring === 999) return null;

      return instance.$moment().add(`-${searchDuring}`, 'minutes').format('YYYY-MM-DD HH:mm:ss');
    };

    const searchDetailList = async ():Promise<void> => {
      const searchParam = {
        groupId: state.data.groupId,
        thresholdResourceType: state.data.thresholdResourceType,
        page: state.data.page,
        size: state.data.size,
      } as SearchParam;

      const from = getFromDate(props.statusType);
      if (from) {
        searchParam.from = from;
      }
      if (state.proxyType === 0) {
        searchParam.resourceVal = state.data.resourceVal;
      } else if (state.proxyType === 1) {
        searchParam.resourceVal = state.data.resourceVal;
        searchParam.recoveryDate = state.data.recoveryDate;
        searchParam.searchType = 'c';
      } else {
        searchParam.searchType = 'i';
        searchParam.from = '';
      }

      const { searchData, eventListData } = await instance.$store.dispatch('event/getEventDetailList', searchParam);
      state.data = { ...state.data, ...searchData };
      state.eventListData = eventListData;
    };

    const searchAlarmGroupList = async ():Promise<void> => {
      state.alarmListData = await instance.$store.dispatch('event/getAlarmGroupUser', state.data.groupId);
    };

    const openModal = (data):void => {
      if (!data) return;

      state.proxyVisible = true;
      state.data = {
        ...state.data,
        organizationId: data.organizationId,
        organizationName: data.orgNm || data.organizationName,
        prometheusId: data.prometheusId,
        prometheusName: data.prometheusNm || data.prometheusName,
        groupId: data.groupId,
        groupName: data.groupInfoNm || data.groupName,
        thresholdResourceType: data.thresholdResourceType,
        resourceType: data.resourceType || '',
        resourceVal: data.resourceVal || '',
        recoveryDate: data.recoveryDate || '',
        parentOrgName: data.parentOrgName || '',
      };

      searchDetailList();
    };

    const changeDetailPage = (page:number) => {
      state.data.page = page;
      searchDetailList();
    };

    const closeModal = ():void => {
      state.proxyVisible = false;
      state.data = defaultDetailData;
      state.activeIdx = 0;
      state.alarmListData = [];
    };

    const cancel = ():void => {
      const confirm = window.confirm('저장하지 않고 나가시겠습니까?');
      if (confirm) closeModal();
    };

    const tabChange = (idx:number):void => {
      state.activeIdx = idx;
      if (idx === 1 && state.alarmListData.length === 0) {
        searchAlarmGroupList();
      }
    };

    return {
      ...toRefs(state),
      openModal,
      closeModal,
      tabChange,
      cancel,
      searchDetailList,
      changeDetailPage,
    };
  },
});
</script>
<style scoped>
  .odd {
    background-color: #F5F5F5;
  }
</style>
