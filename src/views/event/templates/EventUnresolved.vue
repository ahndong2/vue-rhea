<template>
  <div>
    <event-refresh type="Unresolved" />
    <alert-status-table class="mb-16" :alert-status-data="unresolvedAlertStatusData" :status-type="1" />

    <search-form type="EventUnresolved" @search="searchAlertData" />
    <div v-if="unresolved.totalCount > 1" class="tbl-top">
      {{ getResultCount() }}
    </div>
    <event-list-table :check-box="true" :status-type="1" :event-list-data="eventListData" />
    <pagination :current-page="unresolved.page" :total-items="unresolved.totalCount"
                :items-per-page="unresolved.size" :max-size="5" @change="searchPage"
    />
  </div>
</template>

<script lang="ts">
import {
  defineComponent, reactive, toRefs, computed,
} from '@vue/composition-api';
import { getInstance } from '@/composable';
import { AlertStatusTable, Pagination } from '@/components';
import {
  EventRefresh, SearchForm, EventListTable,
} from '@/views/event/modules';

export default defineComponent({
  name: 'EventUnresolved',
  components: {
    EventRefresh,
    AlertStatusTable,
    SearchForm,
    EventListTable,
    Pagination,
  },
  setup() {
    const { instance } = getInstance();
    const state = reactive({
      unresolved: computed(() => instance.$store.state.event.unresolved),
      unresolvedAlertStatusData: computed(() => instance.$store.state.event.unresolvedAlertStatusData),
      eventListData: computed(() => instance.$store.state.event.eventUnresolvedList),
    });

    const searchAlertData = (searchData) => {
      instance.$store.commit('event/setUnresolved', searchData);
      instance.$store.dispatch('event/getEventUnresolvedData');
    };

    const searchPage = (page) => {
      const data = {
        ...state.unresolved,
        page,
      };
      searchAlertData(data);
    };

    const getResultCount = () => {
      const obj = state.unresolved;
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
      searchPage,
      getResultCount,
    };
  },
});
</script>
