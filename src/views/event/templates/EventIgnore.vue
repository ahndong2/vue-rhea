<template>
  <div>
    <search-form type="EventIgnore"
                 @search="searchAlertData"
                 @openModal="openModal"
    />

    <table-container type="data" :height="eventIgnoreData.length < 10 ? '' : '567px'">
      <caption>예외 Event</caption>
      <thead>
        <tr>
          <th scope="col" />
          <th scope="col" />
          <th scope="col">
            <span>Prometheus</span>
          </th>
          <th scope="col">
            <span>Group&amp;Job</span>
          </th>
          <th scope="col">
            <span>발생 자원</span>
          </th>
          <th scope="col">
            <span>Event type</span>
          </th>
          <th scope="col">
            <span>등록자</span>
          </th>
          <th scope="col">
            <span>등록일시</span>
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(data,idx) in eventIgnoreData" :key="idx">
          <td class="has-chk">
            <input :id="data.id" type="radio" name="radio" :checked="data.id === selectId"
                   @change="selectEventList(data.id)"
            >
            <label :for="data.id" class="chk-item" />
          </td>
          <td>
            <button class="btn-detail" @click="openModal(data.id)">
              조회
              <svg xmlns="http://www.w3.org/2000/svg" width="18px" height="18px" viewBox="0 0 24 24">
                <path d="M0 0h24v24H0z" fill="none" />
                <path d="M19 19H5V5h7V3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2v-7h-2v7zM14 3v2h3.59l-9.83 9.83 1.41 1.41L19 6.41V10h2V3h-7z" />
              </svg>
            </button>
          </td>
          <td>
            <span><router-link :to="{ name: 'Monitoring', query: {org: data.organizaionId, prom: data.prometheusId}}" class="link">{{ data.prometheusNm }}</router-link></span>
          </td>
          <td>
            <span>{{ data.groupInfoNm }}</span>
          </td>
          <td>
            <span>{{ data.resourceType }}({{ data.resourceVal }})</span>
          </td>
          <td>
            <span>{{ data.errorType }}</span>
          </td>
          <td>
            <span>{{ data.modifier }}</span>
          </td>
          <td>
            <span>{{ data.registDate }}</span>
          </td>
        </tr>
        <tr v-if="eventIgnoreData.length === 0">
          <td colspan="8" class="empty">
            Event가 없습니다.
          </td>
        </tr>
      </tbody>
    </table-container>
    <pagination :current-page="ignore.page" :total-items="ignore.totalCount"
                :items-per-page="ignore.size" :max-size="5" @change="searchPage"
    />

    <event-modal-exc-update id="exceptionUpdate" ref="exceptionUpdate"
                            @updateEventExc="updateEventExc"
    />
  </div>
</template>

<script lang="ts">
import {
  defineComponent, reactive, toRefs, onMounted, computed,
} from '@vue/composition-api';
import { getInstance } from '@/composable';
import { TableContainer, Pagination } from '@/components';
import {
  SearchForm, EventListTable, EventModalExcUpdate,
} from '@/views/event/modules';

export default defineComponent({
  name: 'EventIgnore',
  components: {
    SearchForm,
    EventListTable,
    TableContainer,
    EventModalExcUpdate,
    Pagination,
  },
  setup() {
    const { instance } = getInstance();
    const ref = instance.$refs as any;

    const state = reactive({
      ignore: computed(() => instance.$store.state.event.ignore),
      alertStatusData: [],
      eventIgnoreData: computed(() => instance.$store.state.event.eventIgnoreList),
      selectId: '',
    });

    const searchAlertData = (searchData) => {
      instance.$store.commit('event/setIgnore', searchData);
      instance.$store.dispatch('event/getEventIgnoreData');
    };

    const searchPage = (page) => {
      const data = {
        ...state.ignore,
        page,
      };
      searchAlertData(data);
    };

    const openModal = (id) => {
      if (id) {
        state.selectId = id;
      }

      if (state.selectId) {
        const data = state.eventIgnoreData.find((v) => v.id === state.selectId);
        const param = {
          groupId: data.groupId,
          thresholdResourceType: data.thresholdResourceType,
        };
        instance.$store.dispatch('event/getEventIgnoreReasonData', param);
        ref.exceptionUpdate.openModal(data);
      } else {
        window.alert('Event를 선택해 주세요.');
      }
    };

    const selectEventList = (id) => {
      state.selectId = id;
    };

    const updateEventExc = (data) => {
      instance.$store.dispatch('event/setEventIgnoreCanclewrite', data);
    };

    onMounted(async () => {
      instance.$store.dispatch('event/getEventIgnoreData');
    });

    return {
      ...toRefs(state),
      searchAlertData,
      openModal,
      selectEventList,
      updateEventExc,
      searchPage,
    };
  },
});
</script>

<style scoped>

</style>
