<template>
  <modal :visible="proxyVisible" size="lg" @closeModal="closeModal">
    <template #header>
      <h3>Event 로그 상세 조회</h3>
    </template>

    <template #body>
      <p class="guide mb-4">
        <i class="fi fi-rr-exclamation" />
        이 팝업의 내용은 이벤트 로그 상세 조회 팝업으로 그룹핑 된 로그 수치를 보여주는 Alert 현황 대시보드 수치와는 다릅니다.
      </p>
      <div class="toolbar mb-6">
        <h3 class="hide">
          검색 영역
        </h3>
        <div class="left-part">
          <div class="tool">
            <input v-model.trim="data.resourceVal" type="text" class="inp-t" placeholder="발생 자원 입력" spellcheck="false">
            <button v-if="data.resourceVal" class="btn-clear" @click="clearInput">
              <i class="fi fi-rr-cross-small" />
              <span class="hide">삭제</span>
            </button>
          </div>
          <div class="tool">
            <select-box id="alertLevel" name="alertLevel" none="Alert 레벨 전체"
                        :value="data.alertLevel" :options="selectAlertLevel" @change="changeSelectBox"
            />
          </div>
          <!-- [S] 최근/기간 선택 (periodYN) -->
          <div class="tool">
            <div class="toggle">
              <input id="period2" v-model="data.periodYN" type="checkbox" name="period2" class="inp" @change="changePeriod">
              <label for="period2" class="label" />
            </div>
          </div>
          <!-- 최근 (default) -->
          <div v-if="!data.periodYN" class="tool">
            <select-box id="selectSearchDuring" name="searchDuring"
                        :value="data.searchDuring" :options="selectSearchDuring" @change="changeSelectBox"
            />
          </div>
          <!-- 기간 -->
          <div v-if="data.periodYN" class="tool">
            <date-picker id="startDate"
                         :options="{ mode: 'datetime', format: dateFormat, is24hr: true }"
                         :date="data.startDate"
                         @change="changeDate"
            />
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" class="w-5 h-5 mx-2 text-gray-600 fill-current">
              <rect fill="none" width="24" height="24" />
              <path d="M15,5l-1.41,1.41L18.17,11H2V13h16.17l-4.59,4.59L15,19l7-7L15,5z" />
            </svg>
            <date-picker id="endDate"
                         :options="{ mode: 'datetime', format: dateFormat, is24hr: true }"
                         :date="data.endDate"
                         @change="changeDate"
            />
          </div>
          <!-- [E] 최근/기간 선택 (periodYN) -->
          <div class="tool">
            <button type="button" class="btn" @click="searchPage">
              <span class="text">검색</span>
            </button>
          </div>
        </div>
      </div>
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
              {{ data.groupJobName }}
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
        </div>
      </div>
      <search-result :page="paging.page" :size="paging.size" :total="paging.totalCount" class="mb-3" />
      <event-list-table :event-list-data="eventListData" />
      <pagination :current-page="paging.page" :total-items="paging.totalCount"
                  :items-per-page="paging.size" :max-size="5" class="mt-6" @change="changePage"
      />
    </template>
  </modal>
</template>

<script lang="ts">
import {
  defineComponent, reactive, toRefs,
} from '@vue/composition-api';
import { getInstance } from '@/composable';
import {
  Modal, Pagination, SelectBox, DatePicker, SearchResult,
} from '@/components';
import { SELECT_OPTIONS } from '@/views/monitoring/constants';
import {
  getEventList,
} from '@/api/monitoring';
import EventListTable from './EventListTable.vue';

interface SearchParam {
  groupId?: string;
  thresholdResourceType?: string;
  searchType?: string;
  resourceVal?: string;
  alertLevel?: string;
  from?: string
  to?: string
  page?: number;
  size?: number;
}

interface Props {
  visible?:boolean;
}

const defaultData = {
  organizationId: '',
  organizationName: '',
  prometheusId: '',
  prometheusName: '',
  groupId: '',
  groupJobName: '',
  thresholdResourceType: '',
  resourceVal: '',
  alertLevel: '',
  periodYN: false,
  searchDuring: 1,
  startDate: '',
  endDate: '',
};

export default defineComponent({
  name: 'EventModalDetail',
  components: {
    Modal,
    Pagination,
    EventListTable,
    SelectBox,
    DatePicker,
    SearchResult,
  },
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
  },
  setup(props: Props) {
    const { instance } = getInstance();
    const {
      ALERT_LEVEL, SEARCH_DURING, TYPE,
    } = SELECT_OPTIONS;
    const state = reactive({
      proxyVisible: props.visible,
      selectMonitoringType: TYPE,
      selectAlertLevel: ALERT_LEVEL,
      selectSearchDuring: SEARCH_DURING,
      dateFormat: 'YYYY-MM-DD HH:mm:ss',
      data: defaultData,
      eventListData: [],
      paging: {
        page: 1,
        totalCount: 0,
        size: 10,
      },
    });

    const validateDate = ():boolean => {
      const start = state.data.startDate;
      const end = state.data.endDate;
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
      if (start > instance.$moment().format(state.dateFormat)) {
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

    const searchPage = async ():Promise<void> => {
      let from = state.data.startDate;
      let to = state.data.endDate;

      if (!state.data.periodYN) { // 최근
        from = state.data?.searchDuring === 999 ? ''
          : instance.$moment().add(`-${state.data?.searchDuring}`, 'hours').format(state.dateFormat);
        to = instance.$moment().format(state.dateFormat);
      }
      if (state.data.periodYN) { // 기간
        const flag = validateDate();
        if (!flag) {
          return;
        }
      }

      const param:SearchParam = {
        groupId: state.data.groupId,
        thresholdResourceType: state.data.thresholdResourceType,
        resourceVal: state.data.resourceVal,
        alertLevel: state.data.alertLevel,
        searchType: 'a',
        from,
        to,
        page: state.paging.page,
        size: state.paging.size,
      };

      await getEventList(param).then((res) => {
        const { data } = res;
        const { content, pageable, totalElements } = data.contents;

        state.eventListData = content || [];

        state.paging = {
          ...state.paging,
          page: pageable.pageNumber + 1,
          totalCount: totalElements,
        };
      });
    };

    const changePage = (page: number):void => {
      state.paging.page = page;
      searchPage();
    };

    const changeSelectBox = (e):void => {
      let value = e.target.value;
      if (e.target.name === 'searchDuring') {
        value = Number(value);
      }
      state.data[e.target.name] = value;
    };

    // 기간 / 최근 토글 change
    const changePeriod = ():void => {
      if (state.data.periodYN) {
        state.data.startDate = instance.$moment().add(-1, 'hours').format(state.dateFormat);
        state.data.endDate = instance.$moment().format(state.dateFormat);
      } else {
        state.data.startDate = '';
        state.data.endDate = '';
      }
    };

    // 기간 date change
    const changeDate = (date, id):void => {
      state.data[id] = date;
    };

    const openModal = (data):void => {
      if (!data) return;

      state.proxyVisible = true;
      state.data = { ...state.data, ...data };
      searchPage();
    };

    const closeModal = ():void => {
      state.proxyVisible = false;
      state.data = defaultData;
      state.paging = {
        page: 1,
        totalCount: 0,
        size: 10,
      };
    };

    const clearInput = ():void => {
      state.data.resourceVal = '';
    };

    return {
      ...toRefs(state),
      openModal,
      closeModal,
      searchPage,
      changePage,
      changeSelectBox,
      changeDate,
      changePeriod,
      clearInput,
    };
  },
});
</script>

<style scoped>
::v-deep .modal-dialog {
  min-height: 600px; /* 기간 조회 시 스크롤바 이슈 */
}
</style>
