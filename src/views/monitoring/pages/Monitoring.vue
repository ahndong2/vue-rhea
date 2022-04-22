<template>
  <main id="content" class="content-wrapper monitoring">
    <div class="content-head">
      <h2 class="content-title">
        모니터링
      </h2>
    </div>

    <div class="content-inner">
      <!-- search form -->
      <div id="toolbar" class="toolbar">
        <h3 class="hide">
          검색 영역
        </h3>
        <div class="left-part">
          <div class="tool">
            <select-box id="organization" name="organization" none="Org 선택"
                        :value="organizationId" :options="organizationList" @change="changeOrganization"
            />
          </div>
          <div class="tool">
            <select-box id="childOrganizationId" name="childOrganizationId" :value="childOrganizationId" none="Org 하위 미선택"
                        :options="childOrganizationsList" :disabled="!organizationId || organizationId === ''" @change="changeChildOrganization"
            />
          </div>
          <div class="tool">
            <select-box id="prometheus" name="prometheus" none="Data Source 전체"
                        :value="prometheusId" :options="prometheusList" :disabled="!organizationId || organizationId === ''" @change="changePrometheus"
            />
          </div>
          <!-- [S] 최근/기간 선택 (periodYN) -->
          <div class="tool">
            <div class="toggle">
              <input id="period" v-model="periodYN" type="checkbox" name="period" class="inp" @change="changePeriod">
              <label for="period" class="label" />
            </div>
          </div>
          <!-- 최근 (default) -->
          <div v-if="!periodYN" class="tool">
            <select-box id="selectSearchDuring" name="searchDuring"
                        :value="searchData.searchDuring" :options="selectSearchDuring" @change="changeSearchDuring"
            />
          </div>
          <!-- 기간 -->
          <div v-if="periodYN" class="tool">
            <date-picker id="startDate"
                         :options="{ mode: 'datetime', format: dateFormat, is24hr: true }"
                         :date="startDate"
                         @change="changeDate"
            />
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" class="w-5 h-5 mx-2 text-gray-600 fill-current">
              <rect fill="none" width="24" height="24" />
              <path d="M15,5l-1.41,1.41L18.17,11H2V13h16.17l-4.59,4.59L15,19l7-7L15,5z" />
            </svg>
            <date-picker id="endDate"
                         :options="{ mode: 'datetime', format: dateFormat, is24hr: true }"
                         :date="endDate"
                         @change="changeDate"
            />
          </div>
          <!-- [E] 최근/기간 선택 (periodYN) -->
          <div class="tool">
            <button type="button" class="btn" @click="searchGroupJobs">
              <span class="text">검색</span>
            </button>
          </div>
          <div v-if="organizationId" class="tool">
            <button id="refresh" class="btn btn-refresh" @click="refreshChartData">
              <i class="fi fi-rr-rotate-right mr-1 text-xs" />
              <span class="text">새로고침</span>
            </button>
          </div>
        </div>
      </div>

      <div v-if="prometheusInfo.name" class="toolbar mt-6">
        <div class="left-part">
          <div class="tool">
            <info
              title="Data Source Info:"
              :content="prometheusInfo.description"
              :mouse-event="true"
            />
            {{ prometheusInfo.csp }}
            <span class="type">Type: {{ prometheusInfo.installationType }}</span>
          </div>
          <div class="tool">
            <a
              v-if="
                !(
                  prometheusInfo.grafanaLink === null ||
                  prometheusInfo.grafanaLink === 'null'
                )"
              title="그라파나 바로가기"
              class="link g"
              @click.stop.prevent="moveLink(prometheusInfo.grafanaLink)"
            >
              <img src="@/assets/icons/ic_grafana.svg" alt="">
              <span>Grafana</span>
            </a>
          </div>
        </div>
      </div>

      <alert-status :alert-status-data="alertStatusList" :status-type="2"
                    class="mt-12"
                    @callback="openModalDetail"
      />
      <event-modal-detail id="eventDetailModal" ref="eventDetailModal" />

      <section v-if="groupJobsList.length > 0" class="mt-12">
        <div v-if="noChart" class="empty">
          [{{ activeType }}]의 경우 자체 솔루션 모니터링 항목으로 별도의 그래프 화면을 제공하지 않고 있습니다.
        </div>
        <hgroup v-show="!noChart" class="section-title">
          <h3>{{ prometheusInfo.name }}</h3>
          <p v-if="activeType === 'K8S'" class="guide">
            <i class="fi fi-rr-exclamation" />
            현재 시점 기준 (과거 날짜로 조회 시 Node/Pod/PodError의 과거 기준 그래프 지원은 안됨.)
          </p>
        </hgroup>
        <group-job-list v-show="!noChart" class="section-content"
                        @search="getMonitoringDetailAction"
        />
      </section>
    </div>
  </main>
</template>

<script lang="ts">
import {
  reactive, toRefs, onMounted, computed,
} from '@vue/composition-api';
import { getInstance } from '@/composable';
import {
  SelectBox, AlertStatus, Info, DatePicker,
} from '@/components';
import { SELECT_OPTIONS } from '@/views/monitoring/constants';
import { GroupJobList, EventModalDetail } from '@/views/monitoring/modules';
import { setLocalStorage } from '@/utils';
// import { MONITORING_INFO } from '@/constants';

interface Props {
  org?: string;
  prom?: string;
  group?: string;
  parent?: string;
}

export default {
  name: 'Monitoring',
  components: {
    SelectBox,
    AlertStatus,
    Info,
    DatePicker,
    GroupJobList,
    EventModalDetail,
  },
  props: {
    org: {
      type: String,
      default: '',
    },
    prom: {
      type: String,
      default: '',
    },
    group: {
      type: String,
      default: '',
    },
    parent: {
      type: String,
      default: '',
    },
  },
  setup(props: Props) {
    const { instance } = getInstance();
    const { SEARCH_DURING } = SELECT_OPTIONS;
    const ref = instance.$refs;

    const state = reactive({
      selectSearchDuring: SEARCH_DURING,
      dateFormat: 'YYYY-MM-DD HH:mm:ss',
      searchData: computed(() => instance.$store.state.monitoring.searchData),
      alertStatusList: computed(() => instance.$store.state.monitoring.alertStatusList),
      organizationName: '',
      organizationId: '',
      childOrganizationId: '',
      prometheusId: '',
      groupId: '',
      prometheusInfo: computed(() => instance.$store.state.monitoring.prometheusInfo),
      organizationList: computed(() => instance.$store.state.monitoring.organizationList),
      childOrganizationsList: [],
      prometheusList: [],
      // prometheusList: computed(() => instance.$store.state.monitoring.prometheusList),
      periodYN: false,
      startDate: '',
      endDate: '',
      activeIdx: computed(() => instance.$store.state.monitoring.activeIdx),
      activeType: computed(() => instance.$store.state.monitoring.activeType),
      groupJobsList: computed(() => instance.$store.state.monitoring.groupJobsList),
      isApiCall: false,
      noChart: computed(() => state.activeType === 'RHEA' || state.activeType === 'WEBHOOK'),
    });

    const changeSearchDuring = (e:Event):void => {
      const target = e.target as HTMLInputElement;
      const data = {
        searchDuring: state.searchData.searchDuring,
        [target.name]: Number(target.value),
      } as {
        searchDuring?: number;
        undefined?: number;
      };
      delete data.undefined;

      instance.$store.commit('monitoring/setSearchData', data);
      // localstorage
      const localStorageData = instance.$store.state.monitoring.searchData;
      setLocalStorage('rhea/monitoring', localStorageData);
    };

    // 기간 / 최근 토글 change
    const changePeriod = ():void => {
      if (state.periodYN) {
        state.startDate = instance.$moment().add(-1, 'hours').format('YYYY-MM-DD HH:mm:ss');
        state.endDate = instance.$moment().format('YYYY-MM-DD HH:mm:ss');
      } else {
        state.startDate = '';
        state.endDate = '';
      }
    };

    // 기간 date change
    const changeDate = (date:string, id:string|number):void => {
      state[id] = date;
    };

    // alertStatus 검색 action
    const searchAlertStatusData = async ():Promise<void> => {
      const searchParam = {
        organizationId: state.childOrganizationId || state.organizationId,
        prometheusId: state.prometheusId,
        startDate: state.startDate,
        endDate: state.endDate,
      };

      await instance.$store.dispatch('monitoring/getAlertStatusData', searchParam);
    };

    const setChildOrganizationsList = (org):void => {
      state.childOrganizationsList = org.childOrganizations.map((v) => ({
        id: v.id,
        label: v.name,
        value: v.id,
        childOrganizations: v.childOrganizations,
        prometheuses: v.prometheuses,
      }));
    };

    const setPrometheusList = (org):void => {
      state.prometheusList = org.prometheuses.map((v) => ({
        id: v.id,
        label: v.name,
        value: v.id,
        groupinfo: v.groupinfo,
      }));
      state.prometheusId = '';
    };

    // org 선택
    const changeOrganization = async (e:Event):Promise<void> => {
      const target = e.target as HTMLInputElement;
      instance.$store.commit('monitoring/initData');

      state.organizationId = target.value;
      if (target.value === '') {
        return;
      }
      state.prometheusId = '';
      state.childOrganizationId = '';

      const selectOrg = state.organizationList.filter((org) => Number(org.id) === Number(state.organizationId))[0];
      setChildOrganizationsList(selectOrg);
      setPrometheusList(selectOrg);
      searchAlertStatusData();
    };

    // org 하위 변경
    const changeChildOrganization = (e:Event):void => {
      const target = e.target as HTMLInputElement;
      state.childOrganizationId = target.value;
      if (!target.value) {
        const select = state.organizationList.filter((org) => Number(org.id) === Number(state.organizationId))[0];
        setPrometheusList(select);
        return;
      }
      const selectOrg = state.childOrganizationsList.filter((org) => Number(org.id) === Number(target.value))[0];
      setPrometheusList(selectOrg);

      searchAlertStatusData();
    };

    const changePrometheus = (e:Event):void => {
      const target = e.target as HTMLInputElement;
      state.prometheusId = target.value;
    };

    const validateDate = ():boolean => {
      const start = state.startDate;
      const end = state.endDate;
      if (
        !start
        || start === 'Invalid date'
        || start === ''
        || !end
        || end === 'Invalid date'
        || end === ''
      ) {
        alert('기간을 선택해 주세요.');
        return false;
      }
      if (start > instance.$moment().format('YYYY-MM-DD HH:mm:ss')) {
        alert('현재 일시보다 미래를 선택할 수 없습니다.');
        return false;
      }
      if (start > end) {
        alert('해당 기간으로 조회 불가합니다.');
        return false;
      }
      if (
        instance.$moment
          .duration(instance.$moment(end).diff(instance.$moment(start)))
          .asMilliseconds() > 86432000
      ) {
        alert('시작 일시와 종료 일시는 24시간 이상 차이 날 수 없습니다.');
        return false;
      }
      return true;
    };

    const getMonitoringDetailAction = async ():Promise<void> => {
      // 중복 호출 방어
      if (state.isApiCall) return;
      state.isApiCall = true;

      if (state.groupJobsList.length === 0) return;
      // 모니터링 데이터 초기화
      instance.$store.commit('monitoring/setMonitoringData', null);
      if (state.groupId) {
        const newActiveIdx = state.groupJobsList.findIndex((v) => v.id === Number(state.groupId));
        instance.$store.commit('monitoring/setActiveIdx', newActiveIdx === -1 ? 0 : newActiveIdx);
      }
      const searchParam = {
        id: state.groupJobsList[state.activeIdx].id,
        startDate: state.startDate,
        endDate: state.endDate,
        searchType: state.activeType,
      };

      await instance.$store.dispatch(
        'monitoring/getMonitoringDetail',
        searchParam,
      );

      state.isApiCall = false;
    };

    const searchGroupJobs = async ():Promise<void> => {
      if (!state.organizationId || state.organizationId === '') {
        alert('Organization 명을 선택해 주세요.');
        return;
      }
      if (state.periodYN) {
        const flag = validateDate();
        if (!flag) {
          return;
        }
      }

      // 모니터링 데이터 초기화
      instance.$store.commit('monitoring/setActiveIdx', 0);
      instance.$store.commit('monitoring/setActiveType', 'RESOURCE');

      await searchAlertStatusData();

      if (state.prometheusId) {
        await instance.$store.dispatch(
          'monitoring/getGroupJobsList',
          state.prometheusId,
        );
        await getMonitoringDetailAction();
      } else {
        instance.$store.commit('monitoring/setGroupJobsList', []);
      }
    };

    const animateRefresh = ():void => {
      const refresh = document.querySelector('#refresh') as HTMLElement;
      refresh.classList.add('on');
      setTimeout(() => { refresh.classList.remove('on'); }, 1000);
    };

    const refreshChartData = ():void => {
      if (!state.organizationId) {
        return;
      }
      if (state.periodYN) {
        const flag = validateDate();
        if (!flag) {
          return;
        }
      }
      getMonitoringDetailAction();
      animateRefresh();
    };

    const openModalDetail = (data):void => {
      let organizationName = '';
      let parentOrgName = '';
      if (state.childOrganizationId) {
        parentOrgName = state.organizationList.find((v) => String(v.value) === state.organizationId).label;
        organizationName = state.childOrganizationsList.find((v) => String(v.value) === state.childOrganizationId).label;
      } else {
        organizationName = state.organizationList.find((v) => String(v.value) === state.organizationId).label;
      }

      const eventModalData = {
        ...data,
        organizationId: state.organizationId,
        prometheusId: state.prometheusId,
        organizationName,
        parentOrgName,
        searchDuring: state.searchData.searchDuring,
        periodYN: state.periodYN,
        startDate: state.startDate,
        endDate: state.endDate,
      };

      ref.eventDetailModal.openModal(eventModalData);
    };

    const applyQueryData = async () => {
      state.organizationId = props.parent ? String(props.parent) : String(props.org);
      state.childOrganizationId = props.parent ? String(props.org) : '';

      const selectOrg = state.organizationList.filter((org) => Number(org.id) === Number(state.organizationId))[0];
      setChildOrganizationsList(selectOrg);

      if (props.parent) {
        const selectCOrg = state.childOrganizationsList.filter((org) => Number(org.id) === Number(state.childOrganizationId))[0];
        setPrometheusList(selectCOrg);
      } else {
        setPrometheusList(selectOrg);
      }

      state.prometheusId = String(props.prom);
      state.groupId = String(props.group || '');

      await searchGroupJobs();
    };

    const moveLink = (link) => {
      let url = 'https://screen.digitalkds.co.kr';
      if (!(link === null || link === 'null')) {
        url = link;
      }
      window.open(url);
    };

    const initData = () => {
      instance.$store.commit('monitoring/initData');
    };

    onMounted(async () => {
      initData();

      await instance.$store.dispatch('monitoring/getOrgListData');
      if (props.org && props.prom) {
        applyQueryData();
      }
    });
    return {
      ...toRefs(state),
      changeDate,
      changeSearchDuring,
      changeOrganization,
      changeChildOrganization,
      changePrometheus,
      searchGroupJobs,
      changePeriod,
      refreshChartData,
      getMonitoringDetailAction,
      moveLink,
      openModalDetail,
    };
  },
};
</script>

<style scoped>
.controls {top: calc(-2rem - 50px);}
.toolbar .slt[name="organization"],
.toolbar .slt[name="prometheus"] {
  width: inherit;
  min-width: 10rem;
}
.toolbar:nth-child(2) {font-size: 15px;}

::v-deep .info-layer {
  top: 28px;
  left: 110px;
  transform: none;
}

.type {
  position: relative;
  padding-left: 8px;
  margin-left: 5px;
}
.type::before {
  content: ' ';
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 1px;
  height: 13px;
  background-color: var(--lightgray);
}

.link {
  display: inline-flex;
  align-items: center;
  vertical-align: top;
}
.link.g {
  color: var(--grafana);
}
.link:hover {
  text-decoration: underline;
}
.link img {
  width: 17px;
  height: 17px;
  margin-right: 3px;
}
.link span {
  padding-top: 2px;
}

.guide {
  position: absolute;
  right: 0.25rem;
  top: 0.25rem;
}
::v-deep .empty {
  font-size: 15px;
  color: var(--gray);
}
</style>
