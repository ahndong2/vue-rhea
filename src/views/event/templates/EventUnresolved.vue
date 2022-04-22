<template>
  <div>
    <event-refresh type="Unresolved" />
    <alert-status :alert-status-data="unresolvedAlertStatusData" :status-type="statusType"
                  @callback="alertStatusCallback"
    />
    <search-form ref="searchForm" type="EventUnresolved" class="mt-16"
                 @search="searchAlertData"
    />
    <search-result :page="unresolved.page" :size="unresolved.size" :total="unresolved.totalCount" class="mb-3" />
    <event-list-table :check-box="false" :status-type="statusType" :event-list-data="eventListData"
                      @openModalStatus="openModalStatus" @openModalDetail="openModalDetail"
    />
    <pagination :current-page="unresolved.page" :total-items="unresolved.totalCount"
                :items-per-page="unresolved.size" :max-size="5" class="mt-10" @change="searchPage"
    />
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
  EventRefresh, SearchForm, EventListTable, EventModalDetail, EventModalStatus,
} from '@/views/event/modules';
import {
  apiSchedule,
} from '@/utils';
import { SearchData } from '../type';

export default defineComponent({
  name: 'EventUnresolved',
  components: {
    EventRefresh,
    AlertStatus,
    SearchForm,
    SearchResult,
    EventListTable,
    Pagination,
    EventModalDetail,
    EventModalStatus,
  },
  setup() {
    const { instance } = getInstance();
    const ref = instance.$refs;

    const state = reactive({
      unresolved: computed(() => instance.$store.state.event.unresolved),
      unresolvedAlertStatusData: computed(() => instance.$store.state.event.unresolvedAlertStatusData),
      eventListData: computed(() => instance.$store.state.event.eventUnresolvedList),
      statusType: 1,
    });

    const scrollTable = ():void => {
      const tbl = document.getElementById('eventListTable') as HTMLElement;
      tbl.scrollTo({ top: 0, left: 0 });
    };

    const checkSearchData = (searchData:SearchData):boolean => {
      let rtn = true;
      Object.keys(searchData).forEach((key) => {
        const search = searchData[key];
        const unresolved = state.unresolved[key];
        if (key !== 'page' && unresolved !== search) {
          rtn = false;
        }
      });
      return rtn;
    };

    // 이벤트 로그 검색
    const searchAlertData = (searchData:SearchData):void => {
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

      instance.$store.commit('event/setUnresolved', updateSearchData);
      instance.$store.dispatch('event/getEventUnresolvedData');
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
        ...state.unresolved,
        page,
      };
      searchAlertData(data);
    };

    const openModalStatus = (data):void => {
      ref.eventModalStatus.openModal(data);
    };
    const openModalDetail = (data):void => {
      ref.eventModalDetail.openModal(data);
    };

    onMounted(async ():Promise<void> => {
      apiSchedule({ name: 'Event', params: { tabKey: 'Unresolved' } });
    });

    return {
      ...toRefs(state),
      searchAlertData,
      alertStatusCallback,
      searchPage,
      openModalStatus,
      openModalDetail,
    };
  },
});
</script>
