<template>
  <div>
    <event-refresh type="Occurred" />
    <alert-status-table class="mb-16" :alert-status-data="occurredAlertStatusData" :status-type="0" />

    <search-form type="EventOccurred"
                 @search="searchAlertData"
                 @openModal="openModal"
    />
    <div v-if="occurred.totalCount > 1" class="tbl-top">
      {{ getResultCount() }}
    </div>
    <event-list-table :check-box="true" :status-type="0" :event-list-data="eventListData" @select="selectEventList" />
    <pagination :current-page="occurred.page" :total-items="occurred.totalCount"
                :items-per-page="occurred.size" :max-size="5" @change="searchPage"
    />
    <event-modal-exc-create id="exceptionCreate" ref="exceptionCreate" @createEventExc="createEventExc" />
  </div>
</template>

<script lang="ts">
import {
  defineComponent, reactive, toRefs, computed,
} from '@vue/composition-api';
import { getInstance } from '@/composable';
import { AlertStatusTable, Pagination } from '@/components';
import {
  EventRefresh, SearchForm, EventListTable, EventModalExcCreate,
} from '@/views/event/modules';

export default defineComponent({
  name: 'EventOccurred',
  components: {
    EventRefresh,
    AlertStatusTable,
    SearchForm,
    EventListTable,
    EventModalExcCreate,
    Pagination,
  },
  setup() {
    const { instance } = getInstance();
    const ref = instance.$refs as any;

    const state = reactive({
      occurred: computed(() => instance.$store.state.event.occurred),
      occurredAlertStatusData: computed(() => instance.$store.state.event.occurredAlertStatusData),
      eventListData: computed(() => instance.$store.state.event.eventOccurredList),
      selectId: '',
    });

    const searchAlertData = (searchData) => {
      instance.$store.commit('event/setOccurred', searchData);
      instance.$store.dispatch('event/getEventOccurredData');
    };

    const searchPage = (page) => {
      const data = {
        ...state.occurred,
        page,
      };
      searchAlertData(data);
    };

    const openModal = () => {
      if (state.selectId) {
        const data = state.eventListData.find((v) => v.id === state.selectId);
        ref.exceptionCreate.openModal(data);
      } else {
        window.alert('Event를 선택해 주세요.');
      }
    };

    const selectEventList = (id) => {
      state.selectId = id;
    };

    const createEventExc = (data) => {
      instance.$store.dispatch('event/setEventIgnoreWrite', data);
    };

    const getResultCount = () => {
      const obj = state.occurred;
      const [page, size, total] = [obj.page, obj.size, obj.totalCount];
      const from = size * (page - 1) + 1;
      const to = size * page > total ? total : size * page;
      const pages = Math.ceil(total / size);
      const res = `검색결과 ${from.toLocaleString()} ~ ${to.toLocaleString()} (${page} page) | 총 ${total.toLocaleString()} 건 (${pages} page)`;
      return res;
    };

    return {
      ...toRefs(state),
      searchAlertData,
      openModal,
      selectEventList,
      createEventExc,
      searchPage,
      getResultCount,
    };
  },
});
</script>
