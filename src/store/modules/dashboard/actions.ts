import { ActionContext } from 'vuex';
import { getDashboardAlertAPI, getOrgMonitoringListAPI } from '@/api/dashboard';
import { DashboardState, RootState, OrgMonitoringList } from '@/store/type';
import moment from 'moment';

export const getDashboardAlertData = async ({ commit, state }: ActionContext<DashboardState, RootState>): Promise<void> => {
  const minute = state.alert?.minute;
  const hour = state.alert?.hour;
  const day = state.alert?.day;

  const param = {
    searchDay: day,
    searchMinute: minute,
    searchTime: hour,
  };

  await getDashboardAlertAPI(param).then((res) => {
    const { data } = res;
    // 시간 조정
    commit('setCurrentTime', moment().format('YYYY-MM-DD HH:mm'));
    commit('setBeforeMinutes', moment().add(`-${minute}`, 'minutes').format('YYYY-MM-DD HH:mm'));
    commit('setBeforeHours', moment().add(`-${hour}`, 'hours').format('YYYY-MM-DD HH:mm'));
    commit('setBeforeDays', moment().add(`-${day}`, 'days').format('YYYY-MM-DD'));
    commit('setAlertSummary', data.contents || { minute: [], time: [] });
  });
};

export const getMonitoringListData = async ({ commit }: ActionContext<DashboardState, RootState>): Promise<void> => {
  await getOrgMonitoringListAPI().then((res) => {
    const { data } = res;
    const monitoringList = [...data.contents];
    const allMonitoringList = [] as OrgMonitoringList[];

    monitoringList.forEach((v) => {
      v.fullName = v.name;
      allMonitoringList.push(v);
      if (v.childOrganizations.length > 0) {
        v.childOrganizations.forEach((v2) => {
          v2.fullName = `${v.name}-${v2.name}`;
          v2.parentId = v.id;
          allMonitoringList.push(v2);
        });
      }
    });

    allMonitoringList.forEach((org) => {
      const prometheuses = org.prometheuses || [];
      let prometheusesUseYnCnt = 0;
      if (prometheuses.length > 0) {
        prometheuses.forEach((p) => {
          if (p.useYn === 'Y') {
            prometheusesUseYnCnt++;
          }
          const groupinfo = p.groupinfo || [];
          let groupinfoUseYnCnt = 0;
          if (groupinfo.length > 0) {
            groupinfo.forEach((g) => {
              if (g.useYn === 'Y') {
                groupinfoUseYnCnt++;
              }
            });
          }
          p.groupinfoUseYnCnt = groupinfoUseYnCnt;
        });
      }
      org.prometheusesUseYnCnt = prometheusesUseYnCnt;
    });

    commit('setOrgMonitoringList', allMonitoringList.filter((org) => org.id !== 100));

    commit('setOrgMonitoringNameList', allMonitoringList.map((v) => v.fullName));
  });
};
