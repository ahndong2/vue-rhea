<template>
  <div>
    <search-form type="EventIgnore"
                 @search="searchAlertData"
                 @openModal="openExcModal"
    />
    <search-result :page="ignore.page" :size="ignore.size" :total="ignore.totalCount" class="mb-3" />
    <table-container type="data" :height="eventIgnoreData.length > 10 ? '500px' : ''">
      <caption>예외 이벤트 로그</caption>
      <thead>
        <tr>
          <th scope="col" />
          <th scope="col" class="text-center">
            상세
          </th>
          <th scope="col">
            Data Source 명
          </th>
          <th scope="col">
            Project 분류
          </th>
          <th scope="col">
            Event type
          </th>
          <th scope="col">
            등록자
          </th>
          <th scope="col">
            등록 일시
          </th>
          <th scope="col" class="text-center">
            사유
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(data,idx) in eventIgnoreData" :key="idx">
          <td class="chk-item">
            <input :id="data.key" type="radio" name="radio" class="inp" :checked="data.key === selectedId"
                   @change="selectEventList(data.key)"
            >
            <label :for="data.key" class="ico" />
          </td>
          <td class="text-center">
            <button class="btn detail" @click="openModalDetail(data)">
              <i class="fi fi-rr-zoom-in" />
              <span class="text">상세</span>
            </button>
          </td>
          <td>
            <span v-if="data.organizationId === 100" :title="data.prometheusNm">{{ data.prometheusNm }}</span>
            <router-link v-else
                         :to="{ name: 'Monitoring', params: {org: data.organizationId, prom: data.prometheusId}}"
                         :title="data.prometheusNm"
            >
              {{ data.prometheusNm }}
            </router-link>
          </td>
          <td>
            <span :title="data.groupInfoNm">{{ data.groupInfoNm }}</span>
          </td>
          <td>
            <span>{{ data.thresholdResourceType }}</span>
          </td>
          <td>
            <span>{{ data.creator }}</span>
          </td>
          <td>
            <span>{{ data.registDate }}</span>
          </td>
          <td class="text-center">
            <button class="btn cause" @click="openExcModal(data.key)">
              <i class="fi fi-rr-document" />
              <span class="text">조회</span>
            </button>
          </td>
        </tr>
        <tr v-if="eventIgnoreData.length === 0">
          <td colspan="20" class="empty">
            Data가 없습니다.
          </td>
        </tr>
      </tbody>
    </table-container>
    <pagination :current-page="ignore.page" :total-items="ignore.totalCount"
                :items-per-page="ignore.size" :max-size="5" class="mt-10" @change="searchPage"
    />

    <event-modal-exc-update id="exceptionUpdate" ref="exceptionUpdate"
                            @updateEventExc="updateEventExc"
    />
    <event-modal-detail id="eventModalDetail" ref="eventModalDetail" :status-type="2" />
  </div>
</template>

<script lang="ts">
import {
  defineComponent, reactive, toRefs, onMounted, computed,
} from '@vue/composition-api';
import { getInstance } from '@/composable';
import { apiSchedule } from '@/utils';
import { SearchResult, TableContainer, Pagination } from '@/components';
import {
  SearchForm, EventListTable, EventModalExcUpdate, EventModalDetail,
} from '@/views/event/modules';

export default defineComponent({
  name: 'EventIgnore',
  components: {
    SearchForm,
    SearchResult,
    EventListTable,
    TableContainer,
    EventModalExcUpdate,
    EventModalDetail,
    Pagination,
  },
  setup() {
    const { instance } = getInstance();
    const ref = instance.$refs;

    const state = reactive({
      ignore: computed(() => instance.$store.state.event.ignore),
      alertStatusData: [],
      eventIgnoreData: computed(() => instance.$store.state.event.eventIgnoreList),
      selectedId: '',
    });

    // 이벤트 로그 검색
    const searchAlertData = (searchData):void => {
      state.selectedId = '';
      instance.$store.commit('event/setIgnore', searchData);
      instance.$store.dispatch('event/getEventIgnoreData');
    };

    const searchPage = (page):void => {
      const data = {
        ...state.ignore,
        page,
      };
      searchAlertData(data);
    };

    const openExcModal = (id):void => {
      if (id) {
        state.selectedId = id;
      }
      if (state.selectedId) {
        const data = state.eventIgnoreData.find((v) => v.key === state.selectedId);
        const param = {
          groupId: data.groupId,
          thresholdResourceType: data.thresholdResourceType,
        };
        instance.$store.dispatch('event/getEventIgnoreReasonData', param);

        ref.exceptionUpdate.openModal(data);
      } else {
        window.alert('선택한 값이 없습니다.');
      }
    };

    const selectEventList = (id):void => {
      state.selectedId = id;
    };

    const updateEventExc = (data):void => {
      instance.$store.dispatch('event/setEventIgnoreCanclewrite', data);
    };

    const openModalDetail = (data):void => {
      ref.eventModalDetail.openModal(data);
    };

    onMounted(async ():Promise<void> => {
      instance.$store.dispatch('event/getEventIgnoreData');
      apiSchedule({ name: 'EventIgnore', params: { tabKey: '' } });
    });

    return {
      ...toRefs(state),
      searchAlertData,
      openExcModal,
      selectEventList,
      updateEventExc,
      searchPage,
      openModalDetail,
    };
  },
});
</script>
