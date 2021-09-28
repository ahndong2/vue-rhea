import store from '@/store';
import { Store } from 'vuex';
import { RootState } from '@/store/type';

let refreshTimer: number;
export const refreshSchedule = (refreshTime: number, func: () => void): void => {
  if (refreshTimer) {
    clearInterval(refreshTimer);
  }

  if (refreshTime === 0) return;
  refreshTimer = setInterval(async () => {
    await func();
  }, refreshTime * 1000);
};

export const clearSchedule = ():void => {
  refreshSchedule(0, () => {});
};

const dashboard = () => {
  store.dispatch('dashboard/getDashboardAlertData');
  store.dispatch('board/getDashboardNoticeBoard');
  store.dispatch('dashboard/getMonitoringListData');
};
const eventOccurred = () => {
  store.dispatch('event/getAlertStatusData', 1);
  store.dispatch('event/getEventOccurredData');
};
const eventUnresolved = () => {
  store.dispatch('event/getAlertStatusData', 2);
  store.dispatch('event/getEventUnresolvedData');
};

// 페이지 라우팅시 스케쥴 시작/다른것 제거
export const apiSchedule = (to):void => {
  const { state } = store as Store<RootState>;
  const dashboardRefreshTime = Number(state.dashboard.alert?.refreshTime);
  const eventOccurredRefreshTime = Number(state.event.occurred?.refreshTime);
  const eventUnresolvedRefreshTime = Number(state.event.unresolved?.refreshTime);
  clearSchedule();
  switch (to.name) {
    case 'DashBoard':
      dashboard();
      refreshSchedule(dashboardRefreshTime, dashboard);
      break;
    case 'Event':
      if (to.query.tabKey === 'Occurred') {
        eventOccurred();
        refreshSchedule(eventOccurredRefreshTime, eventOccurred);
      } else if (to.query.tabKey === 'Unresolved') {
        eventUnresolved();
        refreshSchedule(eventUnresolvedRefreshTime, eventUnresolved);
      }
      break;
    default:
      break;
  }
};
