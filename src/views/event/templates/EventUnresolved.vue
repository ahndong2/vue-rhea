<template>
  <div>
    <event-refresh type="Unresolved" />
    <alert-status-table class="mb-16" :alert-status-data="unresolvedAlertStatusData" :status-type="1" />

    <search-form type="EventUnresolved" @search="searchAlertData" />
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

    return {
      ...toRefs(state),
      searchAlertData,
      searchPage,
    };
  },
});
</script>

<style scoped>

</style>
