<template>
  <div>
    <event-refresh type="Occurred" />
    <alert-status :alert-status-data="occurredAlertStatusData" :status-type="statusType"
                  @callback="alertStatusCallback"
    />
    <search-form ref="searchForm" type="EventOccurred" class="mt-16"
                 @search="searchAlertData"
                 @openModal="openExcModal"
    />
    <search-result :page="occurred.page" :size="occurred.size" :total="occurred.totalCount" class="mb-3" />
    <event-list-table ref="eventListTable" :check-box="true" :status-type="statusType" :event-list-data="eventListData"
                      @select="selectEventList" @openModalStatus="openModalStatus" @openModalDetail="openModalDetail"
    />
    <pagination :current-page="occurred.page" :total-items="occurred.totalCount"
                :items-per-page="occurred.size" :max-size="5" class="mt-10" @change="searchPage"
    />
    <event-modal-exc-create id="exceptionCreate" ref="exceptionCreate" @createEventExc="createEventExc" />
    <event-modal-detail id="eventModalDetail" ref="eventModalDetail" :status-type="statusType" />
    <event-modal-status id="eventModalStatus" ref="eventModalStatus" :status-type="statusType" />
  </div>
</template>

<script lang="ts">
import {
  defineComponent, reactive, toRefs, onMounted, computed,
} from '@vue/composition-api';
import { getInstance } from '@/composable';
import { AlertStatus, SearchResult, Pagination } from '@/components';
import {
  EventRefresh, SearchForm, EventListTable, EventModalExcCreate, EventModalStatus, EventModalDetail,
} from '@/views/event/modules';
import {
  apiSchedule,
} from '@/utils';
import { SearchData } from '../type';

export default defineComponent({
  name: 'EventOccurred',
  components: {
    EventRefresh,
    AlertStatus,
    SearchForm,
    SearchResult,
    EventListTable,
    Pagination,
    EventModalExcCreate,
    EventModalStatus,
    EventModalDetail,
  },
  setup() {
    const { instance } = getInstance();
    const ref = instance.$refs;

    const state = reactive({
      occurred: computed(() => instance.$store.state.event.occurred),
      occurredAlertStatusData: computed(() => instance.$store.state.event.occurredAlertStatusData),
      eventListData: computed(() => instance.$store.state.event.eventOccurredList),
      selectedId: '',
      statusType: 0,
    });

    const scrollTable = ():void => {
      const tbl = document.getElementById('eventListTable') as HTMLElement;
      tbl.scrollTo({ top: 0, left: 0 });
    };

    const checkSearchData = (searchData:SearchData):boolean => {
      let rtn = true;
      Object.keys(searchData).forEach((key) => {
        const search = searchData[key];
        const occurred = state.occurred[key];
        if (key !== 'page' && occurred !== search) {
          rtn = false;
        }
      });
      return rtn;
    };

    // 이벤트 로그 검색
    const searchAlertData = (searchData:SearchData):void => {
      state.selectedId = '';
      ref.eventListTable.selectedId = '';

      let updateSearchData:SearchData = searchData;

      if (!checkSearchData(searchData)) {
        updateSearchData = {
          organizationId: '',
          organizationName: '',
          childOrganizationId: '',
          prometheusId: '',
          prometheusName: '',
          groupId: '',
          groupJobName: '',
          resourceVal: '',
          thresholdResourceType: '',
          status: '',
          parentId: '',
          page: 1,
          ...searchData,
        };
      }

      instance.$store.commit('event/setOccurred', updateSearchData);
      instance.$store.dispatch('event/getEventOccurredData');
      scrollTable();
    };

    // 얼럿 필터링 적용
    const alertStatusCallback = (searchData:SearchData):void => {
      if (!searchData.parentId) {
        searchData.parentId = '-1';
        searchData.childOrganizationId = '-1';
      }

      instance.$refs.searchForm.updateState({ ...searchData });
      searchAlertData(searchData);
    };

    // 페이지 이동
    const searchPage = (page):void => {
      const data = {
        ...state.occurred,
        page,
      };
      searchAlertData(data);
    };

    const openExcModal = ():void => {
      if (state.selectedId) {
        const data = state.eventListData.find((v) => v.key === state.selectedId);
        if (!data) {
          window.alert('선택한 값이 없습니다.');
        }
        ref.exceptionCreate.openModal(data);
      } else {
        window.alert('선택한 값이 없습니다.');
      }
    };

    // EventListTable emit
    const selectEventList = (id):void => {
      state.selectedId = id;
    };

    const createEventExc = (data):void => {
      instance.$store.dispatch('event/setEventIgnoreWrite', data);
    };

    const openModalStatus = (data):void => {
      ref.eventModalStatus.openModal(data);
    };
    const openModalDetail = (data):void => {
      ref.eventModalDetail.openModal(data);
    };

    onMounted(():void => {
      apiSchedule({ name: 'Event', params: { tabKey: 'Occurred' } });
    });

    return {
      ...toRefs(state),
      searchAlertData,
      openExcModal,
      selectEventList,
      createEventExc,
      alertStatusCallback,
      searchPage,
      openModalStatus,
      openModalDetail,
    };
  },
});
</script>
