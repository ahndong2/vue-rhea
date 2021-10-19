<template>
  <modal :visible="data.visible" size="lg" @closeModal="closeModal">
    <template #header>
      <h3>Event 로그 조회</h3>
    </template>

    <template #body>
      <div class="toolbar mt-2 mb-6">
        <h3 class="hide">
          조회 영역
        </h3>
        <div class="left-part">
          <div class="tool">
            <!-- <input v-model="data.type" type="text" class="inp-t" placeholder="발생 자원 입력"> -->
            <select-box id="type" name="type" title="발생 자원 선택"
                        :value="data.type" :options="selectMonitoringType" @change="changeSelectBox"
            />
          </div>
          <div class="tool">
            <select-box id="alertLevel" name="alertLevel" title="Alert 레벨 전체"
                        :value="data.alertLevel" :options="selectAlertLevel" @change="changeSelectBox"
            />
          </div>
          <!-- 최근/기간 선택 (periodYN) -->
          <div class="tool">
            <div class="toggle">
              <input
                id="period2"
                v-model="data.periodYN"
                type="checkbox"
                name="period2"
                class="inp-c"
              >
              <label for="period2" class="label" />
            </div>
          </div>
          <!-- 최근 (default) -->
          <div v-if="!data.periodYN" class="tool">
            <select-box
              id="selectSearchDuring"
              name="searchDuring"
              class="slt"
              :value="data.searchDuring"
              :options="selectSearchDuring"
              @change="changeSelectBox"
            />
          </div>
          <!-- 기간 -->
          <div v-if="data.periodYN" class="tool">
            <date-picker
              id="startDate"
              :options="{ mode: 'datetime', format: dateFormat, is24hr: true }"
              :date="data.startDate"
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
              :date="data.endDate"
            />
          </div>
          <!--// 최근/기간 선택 (periodYN) -->
          <div class="tool">
            <button type="button" class="btn" @click="searchPage">
              조회
            </button>
          </div>
        </div>
      </div>
      <p class="guide">
        이벤트 로그 조회 팝업에서는 조회의 기능만 가능합니다.
      </p>
      <event-list-table :check-box="true" :status-type="0" :event-list-data="eventListData" />
      <pagination :current-page="paging.page" :total-items="paging.totalCount"
                  :items-per-page="paging.size" :max-size="5" @change="searchPage"
      />
    </template>

    <!-- <template #footer>
      <button class="modal-button" @click="closeModal">
        취소
      </button>
    </template> -->
  </modal>
</template>

<script lang="ts">
import {
  defineComponent, reactive, toRefs,
} from '@vue/composition-api';
import { getInstance } from '@/composable';
import {
  Modal, Pagination, SelectBox, DatePicker,
} from '@/components';
import {
  EventListTable,
} from '@/views/event/modules';
import { SELECT_OPTIONS } from '@/views/monitoring/constants';
import {
  getEventList,
} from '@/api/event';

export default defineComponent({
  name: 'EventModal',
  components: {
    Modal,
    Pagination,
    EventListTable,
    SelectBox,
    DatePicker,
  },
  props: {
  },
  setup() {
    const { instance } = getInstance();
    const {
      ALERT_LEVEL, SEARCH_DURING, TYPE,
    } = SELECT_OPTIONS;
    const state = reactive({
      selectMonitoringType: TYPE,
      selectAlertLevel: ALERT_LEVEL,
      selectSearchDuring: SEARCH_DURING,
      dateFormat: 'YYYY-MM-DD HH:mm:ss',
      data: {
        visible: false,
        type: '',
        organizationID: '',
        prometheusID: '',
        alertLevel: '',
        searchDuring: 1,
        startDate: '',
        endDate: '',
        periodYN: false,
      },
      eventListData: [],
      paging: {
        page: 1,
        totalCount: 0,
        size: 10,
      },
    });

    const searchPage = async () => {
      // startDate, endDate 정리
      let from = state.data.startDate || instance.$moment().format(state.dateFormat);
      let to = state.data.endDate || instance.$moment().format(state.dateFormat);
      if (!state.data.periodYN) {
        from = state.data?.searchDuring === 999 ? '' : instance.$moment().add(`-${state.data?.searchDuring}`, 'hours').format(state.dateFormat);
        to = instance.$moment().format(state.dateFormat);
      }

      const param = {
        ...state.data,
        from,
        to,
      };
      console.log(param);
      // await getEventList(param).then((res) => {
      //   const { data } = res;
      //   const { content, pageable, totalElements } = data.contents;

      //   state.eventListData = content || [];

      //   state.paging = {
      //     ...state.paging,
      //     page: pageable.pageNumber + 1,
      //     totalCount: totalElements,
      //   };
      // });
    };

    const changeSelectBox = (e) => {
      let value = e.target.value;
      if (e.target.name === 'searchDuring') {
        value = Number(value);
      }
      state.data[e.target.name] = value;
    };

    // 기간 / 최근 토글 change
    const changePeriod = () => {
      if (state.data.periodYN) {
        // v-cale
        state.data.startDate = instance
          .$moment()
          .add(-1, 'hours')
          .format('YYYY-MM-DD HH:mm:ss');
        state.data.endDate = instance.$moment().format('YYYY-MM-DD HH:mm:ss');
      } else {
        // select
        state.data.startDate = '';
        state.data.endDate = '';
      }
    };

    // 기간 date change
    const changeDate = (date, id) => {
      state.data[id] = date;
    };

    const openModal = (data):void => {
      if (!data.visible) return;
      state.data = { ...state.data, ...data };
      searchPage();
    };
    const closeModal = ():void => {
      state.data = {
        visible: false,
        type: '',
        organizationID: '',
        prometheusID: '',
        alertLevel: '',
        searchDuring: 1,
        startDate: '',
        endDate: '',
        periodYN: false,
      };
    };

    return {
      ...toRefs(state),
      openModal,
      closeModal,
      searchPage,
      changeSelectBox,
      changeDate,
      changePeriod,
    };
  },
});
</script>

<style scoped>
.guide {
  position: relative;
  margin-bottom: 10px;
  text-align: right;
  font-size: 15px;
  color: #888;
}
.guide::before {
  display: inline-block;
  width: 17px;
  height: 17px;
  text-align: center;
  font-size: 12px;
  line-height: 17px;
  color: #999;
  border: 1px solid #a5a5a5;
  border-radius: 10px;
  content: 'i';
}
</style>
