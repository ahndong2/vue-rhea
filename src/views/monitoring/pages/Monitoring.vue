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
          조회 영역
        </h3>
        <div class="left-part">
          <div class="tool">
            <select-box
              id="organization"
              name="organization"
              title="Organization 선택"
              :value="organizationID"
              :options="organizationList"
              @change="changeOrganization"
            />
          </div>
          <div class="tool">
            <select-box
              id="prometheus"
              name="prometheus"
              title="Prometheus 선택"
              :value="prometheusID"
              :options="prometheusList"
              @change="changePrometheus"
            />
          </div>
          <!-- 최근/기간 선택 (periodYN) -->
          <div class="tool">
            <div class="toggle">
              <input
                id="period"
                v-model="periodYN"
                type="checkbox"
                name="period"
                class="inp-c"
                @change="changePeriod"
              >
              <label for="period" class="label" />
            </div>
          </div>
          <!-- 최근 (default) -->
          <div v-if="!periodYN" class="tool">
            <select-box
              id="selectSearchDuring"
              name="searchDuring"
              class="slt"
              :value="searchData.searchDuring"
              :options="selectSearchDuring"
              @change="changeSearchDuring"
            />
          </div>
          <!-- 기간 -->
          <div v-if="periodYN" class="tool">
            <date-picker
              id="startDate"
              :options="{ mode: 'datetime', format: dateFormat, is24hr: true }"
              :date="startDate"
              @change="changeDate"
            />
            <span class="mx-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24px"
                height="24px"
                viewBox="0 0 24 24"
                class="w-5 h-5 fill-current text-gray-600"
              >
                <rect fill="none" height="24" width="24" />
                <path
                  d="M15,5l-1.41,1.41L18.17,11H2V13h16.17l-4.59,4.59L15,19l7-7L15,5z"
                />
              </svg>
            </span>
            <date-picker
              id="endDate"
              :options="{ mode: 'datetime', format: dateFormat, is24hr: true }"
              :date="endDate"
              @change="changeDate"
            />
          </div>
          <!--// 최근/기간 선택 (periodYN) -->
          <div class="tool">
            <button type="button" class="btn" @click="searchGroupJobs">
              조회
            </button>
          </div>
        </div>
        <div class="right-part">
          <div class="tool">
            <button
              title="새로고침"
              class="btn btn-refresh"
              @click="refreshChartData"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24px"
                height="24px"
                viewBox="0 0 24 24"
              >
                <path d="M0 0h24v24H0z" fill="none" />
                <path
                  d="M17.65 6.35C16.2 4.9 14.21 4 12 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08c-.82 2.33-3.04 4-5.65 4-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z"
                />
              </svg>
              새로고침
            </button>
          </div>
        </div>
      </div>

      <div v-if="prometheusInfo.name" class="toolbar mt-6">
        <div class="left-part">
          <div class="tool">
            <info
              title="Prometheus Info:"
              :content="prometheusInfo.description"
              :mouse-event="true"
            />
            {{ prometheusInfo.csp }} |
            Type: {{ prometheusInfo.installationType }}
          </div>
          <div class="tool">
            <a
              v-if="
                !(
                  prometheusInfo.grafanaLink === null ||
                  prometheusInfo.grafanaLink === 'null'
                )
              "
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

      <alert-status-table class="mt-12" :alert-status-data="alertStatusList" :status-type="2" @callback="openEventLogModal" />

      <section
        v-if="groupJobsList.length"
        id="monitoring"
        class="monitoring mt-16"
      >
        <h3 class="section-title">
          {{ prometheusInfo.name }}
        </h3>
        <group-job-panel
          ref="groupJobPanel"
          class="section-content mt-1"
          @search="getMonitoringDetailAction"
        />
      </section>
    </div>
    <event-modal ref="eventDetailModal" />
  </main>
</template>

<script lang="ts">
import {
  reactive, toRefs, onMounted, computed,
} from '@vue/composition-api';
import { getInstance } from '@/composable';
import {
  SelectBox, AlertStatusTable, Info, DatePicker,
} from '@/components';
import { SELECT_OPTIONS } from '@/views/monitoring/constants';
import { GroupJobPanel, EventModal } from '@/views/monitoring/modules';
import { setLocalStorage } from '@/utils';

export default {
  name: 'Monitoring',
  components: {
    SelectBox,
    AlertStatusTable,
    Info,
    DatePicker,
    GroupJobPanel,
    EventModal,
  },
  setup() {
    const { instance } = getInstance();
    const { SEARCH_DURING } = SELECT_OPTIONS;
    const ref = instance.$refs as any;

    const state = reactive({
      selectSearchDuring: SEARCH_DURING,
      dateFormat: 'YYYY-MM-DD HH:mm:ss',
      searchData: computed(() => instance.$store.state.monitoring.searchData),
      alertStatusList: computed(
        () => instance.$store.state.monitoring.alertStatusList,
      ),
      organizationID: '',
      prometheusID: '',
      prometheusInfo: computed(
        () => instance.$store.state.monitoring.prometheusInfo,
      ),
      organizationList: computed(
        () => instance.$store.state.monitoring.organizationList,
      ),
      prometheusList: computed(
        () => instance.$store.state.monitoring.prometheusList,
      ),
      periodYN: false,
      startDate: '',
      endDate: '',
      activeIdx: computed(() => instance.$store.state.monitoring.activeIdx),
      groupJobsList: computed(
        () => instance.$store.state.monitoring.groupJobsList,
      ),
    });

    const changeSearchDuring = (e) => {
      const data = {
        searchDuring: state.searchData.searchDuring,
        [e.target.name]: Number(e.target.value),
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
    const changePeriod = () => {
      if (state.periodYN) {
        // v-cale
        state.startDate = instance
          .$moment()
          .add(-1, 'hours')
          .format('YYYY-MM-DD HH:mm:ss');
        state.endDate = instance.$moment().format('YYYY-MM-DD HH:mm:ss');
      } else {
        // select
        state.startDate = '';
        state.endDate = '';
      }
    };

    // 기간 date change
    const changeDate = (date, id) => {
      state[id] = date;
    };

    // alertStatus 검색 action
    const searchAlertStatusData = async () => {
      const searchParam = {
        organizationID: state.organizationID,
        prometheusID: state.prometheusID,
        startDate: state.startDate,
        endDate: state.endDate,
      };

      await instance.$store.dispatch(
        'monitoring/getAlertStatusData',
        searchParam,
      );
    };

    // orgID 변경
    const changeOrganization = async (e) => {
      instance.$store.commit('monitoring/initData');

      if (e.target.value === '') {
        return;
      }
      state.organizationID = e.target.value;
      state.prometheusID = '';

      instance.$store.dispatch(
        'monitoring/getPrometheusList',
        state.organizationID,
      );
      searchAlertStatusData();
    };

    const changePrometheus = (e) => {
      state.prometheusID = e.target.value;
      instance.$store.commit('monitoring/setActiveIdx', 0);
    };

    const validateDate = () => {
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

      if (start > end) {
        alert('시작일은 종료일 보다 클수 없습니다.');
        return false;
      }
      if (
        instance.$moment
          .duration(instance.$moment(end).diff(instance.$moment(start)))
          .asMilliseconds() > 86432000
      ) {
        alert('시작 시간과 종료 시간은 24시간 이상 차이 날 수 없습니다.');
        return false;
      }
      return true;
    };

    const getMonitoringDetailAction = async () => {
      if (state.groupJobsList.length === 0) return;
      const idx = state.activeIdx;
      const searchParam = {
        id: state.groupJobsList[idx].id,
        startDate: state.startDate,
        endDate: state.endDate,
        searchType: state.groupJobsList[idx].installationType === 'VM' ? 'CPU,Memory,Storage,NetworkReception' : 'Node,Pod,PodError',
      };

      await instance.$store.dispatch(
        'monitoring/getMonitoringDetail',
        searchParam,
      );
    };
    const searchGroupJobs = async () => {
      if (!state.organizationID || state.organizationID === '') {
        return;
      }
      if (state.periodYN) {
        const flag = validateDate();
        if (!flag) {
          return;
        }
      }

      await searchAlertStatusData();
      if (state.prometheusID) {
        await instance.$store.dispatch(
          'monitoring/getGroupJobsList',
          state.prometheusID,
        );
        await getMonitoringDetailAction();
      }
    };

    const refreshChartData = () => {
      if (!state.organizationID) {
        return;
      }
      if (state.periodYN) {
        const flag = validateDate();
        if (!flag) {
          return;
        }
      }
      getMonitoringDetailAction();
    };

    const openEventLogModal = (type) => {
      const eventModalData = {
        type,
        visible: true,
        organizationID: state.organizationID,
        prometheusID: state.prometheusID,
        searchDuring: state.searchData.searchDuring,
        periodYN: state.periodYN,
        startDate: state.startDate,
        endDate: state.endDate,
      };

      ref.eventDetailModal.openModal(eventModalData);
    };

    const applyQueryData = async () => {
      state.organizationID = String(instance.$route.query.org);
      await instance.$store.dispatch(
        'monitoring/getPrometheusList',
        state.organizationID,
      );
      state.prometheusID = String(instance.$route.query.prom);

      await searchGroupJobs();
      // await getMonitoringDetailAction();
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
      if (instance.$route.query.org && instance.$route.query.prom) {
        applyQueryData();
      } else {
        initData();
      }

      await instance.$store.dispatch('monitoring/getOrgListData');
    });

    return {
      ...toRefs(state),
      changeDate,
      changeSearchDuring,
      changeOrganization,
      changePrometheus,
      searchGroupJobs,
      changePeriod,
      refreshChartData,
      getMonitoringDetailAction,
      moveLink,
      openEventLogModal,
    };
  },
};
</script>

<style scoped>
.controls {
  top: calc(-2rem - 50px);
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
</style>
