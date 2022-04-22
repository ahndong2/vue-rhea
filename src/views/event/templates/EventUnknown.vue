<template>
  <div class="relative">
    <p class="guide pr-1 text-right">
      <i class="fi fi-rr-exclamation" />
      모니터링 관리 설정에 등록되지 않은 건들에 대해서는 모니터링 항목이 수집되지 않습니다.<br>
      <b>Admin &gt; 모니터링 관리</b> 에서 미등록 된 명들을 등록해 주세요. <a href="/backoffice/main" class="link ml-1">[바로가기]</a>
    </p>
    <div id="toolbar" class="toolbar mb-6">
      <h3 class="hide">
        검색 영역
      </h3>
      <div class="left-part">
        <div class="tool">
          <date-picker id="date" ref="date"
                       :options="{ mode: 'date', format: dateFormat, is24hr: true }"
                       :date="searchData.registDate"
                       title="미등록 수집일 선택"
                       @change="changeDate"
          />
        </div>
        <div class="tool">
          <select-box id="releaseYn" name="releaseYn" none="구분 전체"
                      :value="searchData.releaseYn" :options="releaseYnList" @change="changeReleaseYn"
          />
        </div>
        <div class="tool">
          <button type="button" class="btn" @click="searchPage">
            <span class="text">검색</span>
          </button>
        </div>
      </div>
    </div>
    <search-result :page="searchData.page" :size="searchData.size" :total="searchData.totalCount" class="mb-3" />
    <table-container type="data" :height="unknownListTable.length > 10 ? '500px' : ''">
      <caption>미등록 자원</caption>
      <colgroup>
        <col style="width:auto;">
        <col style="width:auto;">
        <col style="width:auto;">
        <col style="width:auto;">
        <col style="width:auto;">
        <col style="width:auto;">
        <col style="width:10%;">
        <col style="width:auto;">
        <col style="width:auto;">
        <col style="width:auto;">
      </colgroup>
      <thead>
        <tr>
          <th v-if="isAdmin" scope="col" class="text-center">
            등록
          </th>
          <th scope="col">
            Data Source URL
          </th>
          <th scope="col">
            External Label
          </th>
          <th scope="col">
            Project 명
          </th>
          <th scope="col">
            Group 명
          </th>
          <th scope="col">
            Job 명
          </th>
          <th scope="col" class="text-center">
            구분
          </th>
          <th scope="col">
            미등록 수집일
          </th>
          <th scope="col">
            미등록 최근 확인일
          </th>
          <th scope="col">
            등록 완료일
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(data,idx) in unknownListTable" :key="idx">
          <td class="text-center">
            <button v-if="isAdmin && data.releaseYn==='N'"
                    class="btn status"
                    @click="openModalRelease(data)"
            >
              <span class="text">등록</span>
            </button>
          </td>
          <td>
            {{ data.dataSourceUrl }}
          </td>
          <td>
            {{ data.externalLabel }}
          </td>
          <td>
            {{ data.projectName }}
          </td>
          <td>
            {{ data.groupName }}
          </td>
          <td>
            {{ data.jobName }}
          </td>
          <td class="text-center">
            {{ data.releaseYn === 'Y' ? '등록' : '미등록' }}
          </td>
          <td>
            {{ $moment(data.registDate).format('YYYY-MM-DD') }}
          </td>
          <td>
            {{ $moment(data.lastCheckDate).format('YYYY-MM-DD') }}
          </td>
          <td>
            {{ data.releaseDate ? $moment(data.releaseDate).format('YYYY-MM-DD') : '' }}
          </td>
        </tr>
        <tr v-if="unknownListTable.length === 0">
          <td colspan="9" class="empty">
            Data가 없습니다.
          </td>
        </tr>
      </tbody>
    </table-container>
    <pagination :current-page="searchData.page" :total-items="searchData.totalCount"
                :items-per-page="searchData.size" :max-size="5" class="mt-10" @change="changePage"
    />
    <event-modal-release ref="eventModalRelease" @save="saveUnkown" />
  </div>
</template>

<script lang="ts">
import {
  defineComponent, reactive, toRefs, onMounted, computed,
} from '@vue/composition-api';
import {
  SelectBox, TableContainer, DatePicker, Pagination, SearchResult,
} from '@/components';
import { apiSchedule } from '@/utils';
import { getInstance } from '@/composable';
import { EventModalRelease } from '../modules';

export default defineComponent({
  name: 'EventUnknown',
  components: {
    SelectBox,
    TableContainer,
    DatePicker,
    Pagination,
    SearchResult,
    EventModalRelease,
  },
  setup() {
    const { instance } = getInstance();
    const ref = instance.$refs;

    const state = reactive({
      dateFormat: 'YYYY-MM-DD',
      unknownListTable: computed(() => instance.$store.state.event.unknownListTable),
      releaseYnList: [{ label: '미등록', value: 'N' }, { label: '등록', value: 'Y' }],
      searchData: {
        registDate: '',
        releaseYn: 'N',
        page: computed(() => instance.$store.state.event.unknown.page),
        totalCount: computed(() => instance.$store.state.event.unknown.totalCount),
        size: computed(() => instance.$store.state.event.unknown.size),
      },
      isAdmin: computed(() => {
        const userInfo = instance.$store.state.global.userInfo;
        if (!userInfo.name) return false;
        return userInfo.roleList.find((v) => v.name === 'ADMIN') !== undefined;
      }),
    });

    // 기간 date change
    const changeDate = (date:string):void => {
      state.searchData.registDate = date;
    };

    const resetSearchData = ():void => {
      const paging = {
        page: 1,
        size: 20,
        totalCount: 0,
      };
      instance.$store.commit('event/setUnknown', paging);
    };

    // 구분 change
    const changeReleaseYn = (e:Event):void => {
      resetSearchData();
      const target = e.target as HTMLInputElement;
      const { name, value } = target;
      state.searchData[name] = value;
    };

    const searchPage = () => {
      const current = instance.$moment();
      const select = instance.$moment(state.searchData.registDate);

      if (select && current <= select) {
        alert('현재 일시보다 미래를 선택 할 수 없습니다.');
        ref.date.setDate('');
        return;
      }

      instance.$store.dispatch('event/getUnknownList', state.searchData);
    };

    const changePage = (page) => {
      if (page) {
        const paging = {
          page,
          totalCount: state.searchData.totalCount,
          size: state.searchData.size,
        };
        console.log(paging);
        instance.$store.commit('event/setUnknown', paging);
      }
      searchPage();
    };

    const openModalRelease = (data): void => {
      ref.eventModalRelease.openModal(data);
    };

    const saveUnkown = (data):void => {
      const queryStr = new URLSearchParams(data).toString();
      window.location.href = `/backoffice/datasettings/groupjob?${queryStr}`;
    };

    onMounted(async ():Promise<void> => {
      searchPage();
      apiSchedule({ name: 'EventUnknown', params: { tabKey: '' } });
    });

    return {
      ...toRefs(state),
      changeDate,
      changeReleaseYn,
      searchPage,
      changePage,
      openModalRelease,
      saveUnkown,
    };
  },
});
</script>

<style scoped>
.guide {
  position: absolute;
  right: 0;
  top: 0;
  z-index: 5;
}
.guide .link {
  text-decoration: underline;
  color: var(--KB-gold);
}
</style>
