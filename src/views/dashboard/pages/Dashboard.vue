<template>
  <main id="dashboard" class="dashboard grid grid-cols-12 gap-8">
    <section id="alertSummary" class="alert-summary col-span-12">
      <h3 class="section-title">
        <span @mouseenter="checkMouseEvent" @mouseleave="checkMouseEvent">
          Alert 현황
          <i class="ic-info">i</i>
        </span>
      </h3>
      <tooltip :content="tooltipContent" :visible="tooltipVisible"
               :style="{ top: 50 + 'px', left: 210 + 'px' }"
               @mouse="checkMouseEvent"
      />

      <div class="controls">
        <button id="refresh" title="새로고침" class="btn-refresh rounded-l-md" @click="getAllAlertData">
          <i class="fi fi-rr-rotate-right" />
        </button>
        <select-box id="selectOptionsPageRefreshTime" name="refreshTime" title="새로고침 주기" class="rounded-r-md"
                    :value="viewOptions.refreshTime" :options="selectOptionsPageRefreshTime" @change="changeSelectAlert"
        />
      </div>

      <div class="section-content grid grid-cols-12 gap-8">
        <div class="panel col-span-12 lg:col-span-8">
          <div class="panel-title">
            <span class="text mr-2">최근</span>
            <select-box id="selectOptionsMinutes" name="minute"
                        :value="viewOptions.minute" :options="selectOptionsMinutes" @change="changeSelectAlert"
            />
            <em v-if="beforeMinutes" class="period pr-1">
              {{ beforeMinutes }} ~ {{ currentTime }}
            </em>
          </div>
          <div class="panel-content">
            <summary-panel :summary-data="alertSummaryMinute" />
          </div>
        </div>
        <div class="panel col-span-12 lg:col-span-4">
          <div class="panel-title">
            <select-box id="selectOptionsDays" name="day"
                        :value="viewOptions.day" :options="selectOptionsDays" @change="changeSelectAlert"
            />
            <span class="text ml-2">누적 미해제</span>
            <em v-if="beforeDays" class="period pr-1">
              {{ beforeDays }} ~
            </em>
          </div>
          <div class="panel-content">
            <router-link :to="{ name: 'Event'}">
              <div class="summary-panel">
                <dl class="item unresolved">
                  <dd class="count">
                    {{ dayUnresolvedCnt || 0 }}
                  </dd>
                  <dd v-if="dayUnresolvedCnt !== null" class="text">
                    미해제
                  </dd>
                </dl>
              </div>
            </router-link>
          </div>
        </div>
        <div class="panel col-span-12 lg:col-span-8">
          <div class="panel-title">
            <span class="text mr-2">최근</span>
            <select-box id="selectOptionsHours" name="hour"
                        :value="viewOptions.hour" :options="selectOptionsHours" @change="changeSelectAlert"
            />
            <em v-if="beforeHours" class="period pr-1">
              {{ beforeHours }} ~ {{ currentTime }}
            </em>
          </div>
          <div class="panel-content">
            <summary-panel :summary-data="alertSummaryTime" />
          </div>
        </div>
        <div class="panel col-span-12 lg:col-span-4">
          <div class="panel-title">
            <span class="text"><b>전체</b> 누적 미해제</span>
          </div>
          <div class="panel-content">
            <router-link :to="{ name: 'Event'}">
              <div class="summary-panel">
                <dl class="item unresolved">
                  <dd class="count">
                    {{ totalUnresolvedCnt || 0 }}
                  </dd>
                  <dd v-if="totalUnresolvedCnt !== null" class="text">
                    미해제
                  </dd>
                </dl>
              </div>
            </router-link>
          </div>
        </div>
      </div>
    </section>

    <section id="monitoring" class="monitoring col-span-12 lg:col-span-8">
      <h3 class="section-title">
        <router-link :to="{ name: 'Monitoring'}">
          모니터링
          <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 24 24" class="ico fill-current">
            <path d="M0 0h24v24H0z" fill="none" />
            <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z" />
          </svg>
        </router-link>
      </h3>
      <monitoring-list :monitoring-data="monitoringListData" @update="updateMonitoringListData" />
    </section>

    <section id="notice" class="notice col-span-12 lg:col-span-4">
      <h3 class="section-title">
        <router-link :to="{ name: 'NoticeList'}">
          공지사항
          <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 24 24" class="ico fill-current">
            <path d="M0 0h24v24H0z" fill="none" />
            <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z" />
          </svg>
        </router-link>
      </h3>
      <div class="section-content">
        <ul class="notice-list">
          <!-- 게시물 없을 경우 -->
          <li v-if="noticeBoardList.length === 0" class="empty">
            최근 7일간 게시물이 없습니다.
          </li>
          <!-- 당일 포함 7일간 게시물 : 최대 5개 -->
          <li v-for="(notice, idx) in noticeBoardList" v-else :key="idx" class="notice-item">
            <router-link :to="{ name: 'NoticeDetail', params: { postId: notice.id }}"
                         class="notice-link"
            >
              <span class="tit ellipsis">{{ notice.title }}</span>
              <span class="date">{{ $moment(notice.regDate).format('YYYY-MM-DD') }}</span>
            </router-link>
          </li>
        </ul>
      </div>
    </section>
  </main>
</template>

<script lang="ts">
import {
  reactive, toRefs, computed, watch,
} from '@vue/composition-api';
import { getInstance } from '@/composable';
import { setLocalStorage, apiSchedule } from '@/utils';
import { SelectBox, Tooltip } from '@/components';
import { SummaryPanel, MonitoringList } from '@/views/dashboard/modules';
import {
  SELECT_OPTIONS,
} from '@/views/dashboard/constants';

export default {
  name: 'Dashboard',
  components: {
    SelectBox,
    SummaryPanel,
    MonitoringList,
    Tooltip,
  },
  setup() {
    const { instance } = getInstance();
    const {
      REFRESH_TIME, MINUTES, HOURS, DAYS,
    } = SELECT_OPTIONS;

    const state = reactive({
      selectOptionsPageRefreshTime: REFRESH_TIME,
      selectOptionsMinutes: MINUTES,
      selectOptionsHours: HOURS,
      selectOptionsDays: DAYS,
      viewOptions: computed(() => instance.$store.state.dashboard.alert),
      currentTime: computed(() => instance.$store.state.dashboard.currentTime),
      beforeMinutes: computed(() => instance.$store.state.dashboard.beforeMinutes),
      beforeHours: computed(() => instance.$store.state.dashboard.beforeHours),
      beforeDays: computed(() => instance.$store.state.dashboard.beforeDays),
      alertSummaryMinute: computed(() => instance.$store.state.dashboard.alertSummaryMinute),
      alertSummaryTime: computed(() => instance.$store.state.dashboard.alertSummaryTime),
      dayUnresolvedCnt: computed(() => instance.$store.state.dashboard.dayUnresolvedCnt),
      totalUnresolvedCnt: computed(() => instance.$store.state.dashboard.totalUnresolvedCnt),
      monitoringListData: computed(() => instance.$store.state.dashboard.orgMonitoringList),
      organizationNameList: computed(() => instance.$store.state.dashboard.orgMonitoringNameList),
      noticeBoardList: computed(() => instance.$store.state.board.dashBoardNoticeBoardList),
      tooltipVisible: false,
      tooltipContent: computed(() => {
        let html = '<p class="mb-1">아래 시스템 Alert 현황입니다.</p>';
        html += '<ul class="info-list">';
        state.organizationNameList.forEach((name) => {
          html += `<li>&middot; ${name}</li>`;
        });
        html += '</ul>';
        return html;
      }),
    });

    const animateRefresh = ():void => {
      const refresh = document.querySelector('#refresh') as HTMLElement;
      refresh.classList.add('on');
      setTimeout(() => { refresh.classList.remove('on'); }, 1000);
    };

    const changeSelectAlert = (e:Event):void => {
      const target = e.target as HTMLInputElement;
      const selectAlert = { [target.name]: Number(target.value) };
      instance.$store.commit('dashboard/setAlert', selectAlert);
      instance.$store.dispatch('dashboard/getDashboardAlertData');
      animateRefresh();
    };

    const updateMonitoringListData = (i:number, j?:number):void => {
      const copyData = [...state.monitoringListData];
      if (copyData[i].prometheusesUseYnCnt === 0) {
        return;
      }
      if (j === undefined) {
        if (copyData[i].prometheuses.length > 0) {
          copyData[i].active = !copyData[i].active;
          copyData[i].prometheuses[0].active = !copyData[i].prometheuses[0].active;
        }
      } else if (copyData[i].prometheuses[j].groupinfo.length > 0) {
        if (copyData[i].prometheuses[j].groupinfoUseYnCnt === 0) {
          return;
        }
        copyData[i].prometheuses[j].active = !copyData[i].prometheuses[j].active;
      }
      // 하위 컴포넌트
      instance.$store.commit('dashboard/setOrgMonitoringList', copyData);
    };

    const getAllAlertData = async ():Promise<void> => {
      instance.$store.dispatch('dashboard/getDashboardAlertData');
      instance.$store.dispatch('board/getDashboardNoticeBoard');
      instance.$store.dispatch('dashboard/getMonitoringListData');
      animateRefresh();
    };

    const checkMouseEvent = (e:Event):void => {
      if (!state.tooltipContent) return;
      if (e.type === 'mouseenter') {
        state.tooltipVisible = true;
      } else if (e.type === 'mouseleave') {
        state.tooltipVisible = false;
      }
    };

    watch(() => state.viewOptions, (newValue, oldvalue):void => {
      if (newValue.refreshTime !== oldvalue.refreshTime) {
        apiSchedule({ name: 'Dashboard' });
      }
      setLocalStorage('rhea/dashboard', state.viewOptions);
    });

    return {
      ...toRefs(state),
      changeSelectAlert,
      getAllAlertData,
      updateMonitoringListData,
      checkMouseEvent,
    };
  },
};
</script>

<style scoped>
.dashboard {
  position: relative;
  width: 100%;
  max-width: var(--inner-width);
  margin: 0 auto;
  padding: 0 1.5rem;
  cursor: default;
}
.dashboard > section {
  position: relative;
}
.dashboard .section-title {
  padding: 3rem 0 1rem;
  font-size: 40px;
}
.dashboard .section-title > a {
  display: inline-flex;
  align-items: center;
}
.dashboard .section-title > a:hover .ico {
  animation: bounceRight .5s 10;
}
@keyframes bounceRight {
  0%, 100% {
    transform: none;
    transition-timing-function: ease-in;
  }
  40% {
    transform: translateX(5px);
    transition-timing-function: ease-out;
  }
}
.ic-info {
  display: inline-block;
  width: 17px;
  height: 17px;
  font-size: 11px;
  line-height: 1.9;
  text-align: center;
  color: var(--white);
  background: #a5a5a5;
  border-radius: 15px;
  vertical-align: 50%;
}
</style>
<style>
.info-list {
  overflow: hidden auto;
  max-height: 70vh;
}
</style>
<style scoped>
/* Alert Summary */
.alert-summary .controls {
  top: 3.6rem;
}
.alert-summary .panel-title {
  display: flex;
  flex-wrap: wrap;
  padding: 1rem 0;
  line-height: 40px;
  font-size: 21px;
}
.alert-summary .panel-title .text {
  letter-spacing: 1px;
  white-space: nowrap;
}
.alert-summary .panel-title .slt {
  height: 2.375rem;
  padding-right: 2rem;
  font-weight: bold;
  font-size: 19px;
  letter-spacing: 1px;
  background-position: right 60%;
  border-bottom: 3px solid;
}
.alert-summary .panel-title .period {
  margin-left: auto;
  font-family: 'KBFGTextL';
  font-size: 15px;
  color: var(--KB-silver);
}
.alert-summary .panel-content {
  height: 12rem;
  background: #fff;
  border-radius: 6px;
  box-shadow: 0px 2px 3px rgba(0,0,0,.1);
}

/* notice */
.notice-list .notice-item {
  position: relative;
  height: 3rem;
}
.notice-list .notice-item:not(:first-child) {
  border-top: 1px solid #ddd;
}
.notice-list .notice-link {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  height: 100%;
  padding: 0 0.25rem;
}
.notice-list .notice-item .tit {
  max-width: calc(100% - 120px);
  font-size: 16px;
  color: #333;
}
.notice-list .notice-link:hover .tit {
  color: var(--KB-gold);
}
.notice-list .notice-item .date {
  overflow: hidden;
  flex: 0 0 100px;
  text-align: right;
  font-family: 'KBFGTextL';
  font-size: 15px;
  color: var(--gray);
  white-space: nowrap;
}
.notice-list .empty {
  text-align: center;
  line-height: 3rem;
  color: var(--gray);
}
</style>
