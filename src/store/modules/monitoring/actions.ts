import { ActionContext } from 'vuex';
import {
  getAlertStatusListAPI,
  getOrgMonitoringListAPI, getPrometheusListAPI,
  getGroupJobsListAPI, getMonitoringDetailAPI,
} from '@/api/monitoring';
import { MonitoringState, SearchData, RootState } from '@/store/type';
import { setMonitoringListDataFactory } from '@/utils/data';
import moment from 'moment';

export const getAlertStatusData = async ({ commit, state }: ActionContext<MonitoringState, RootState>, searchParam): Promise<void> => {
  const param = {
    ...searchParam,
    startDate: searchParam.startDate ? searchParam.startDate : moment().add(`-${state.searchData?.searchDuring}`, 'hours').format('YYYY-MM-DD HH:mm:ss'),
    endDate: searchParam.endDate ? searchParam.endDate : moment().format('YYYY-MM-DD HH:mm:ss'),
    organizationId: searchParam.organizationID,
    prometheusId: searchParam.prometheusID || 0,
    eventType: 0,
  };

  await getAlertStatusListAPI(param).then((res) => {
    const { data } = res;
    const { contents } = data;
    commit('setAlertStatusList', contents);
  });
};

export const getOrgListData = async ({ commit }: ActionContext<MonitoringState, RootState>): Promise<void> => {
  await getOrgMonitoringListAPI().then((res) => {
    const { data } = res;
    const { contents } = data;
    // selectbox 에 맞춤
    const orgData = contents.map((v) => ({
      id: v.id,
      label: v.name,
      value: v.id,
    }));
    commit('setOrganizationList', orgData);
  });
};

export const getPrometheusList = async ({ commit }: ActionContext<MonitoringState, RootState>, orgId:string): Promise<void> => {
  const param = {
    orgId,
    useYn: 'Y',
  };
  await getPrometheusListAPI(param).then((res) => {
    const { data } = res;
    const { contents } = data;

    // selectbox 에 맞춤
    const orgData = contents.map((v) => ({
      id: v.id,
      label: v.name,
      value: v.id,
    }));
    commit('setPrometheusList', orgData);
  });
};

export const getGroupJobsList = async ({ commit }: ActionContext<MonitoringState, RootState>, prometheusId:string): Promise<void> => {
  const param = {
    prometheusId,
    useYn: 'Y',
  };
  await getGroupJobsListAPI(param).then((res) => {
    const { data } = res;
    const { contents } = data;

    contents.groupinfo.forEach((v) => {
      v.installationType = contents.installationType;
      v.prometheusName = contents.name;
    });

    const prometheusInfo = {
      name: contents.name,
      csp: contents.csp,
      installationType: contents.installationType,
      grafanaLink: contents.grafanaLink,
      description: contents.description,
    };

    commit('setGroupJobsList', contents.groupinfo || []);
    commit('setPrometheusInfo', prometheusInfo);
  });
};

export const getMonitoringDetail = async ({ commit, state }: ActionContext<MonitoringState, RootState>, searchParam:SearchData): Promise<void> => {
  searchParam.start = searchParam.startDate ? searchParam.startDate : moment().add(`-${state.searchData?.searchDuring}`, 'hours').format('YYYY-MM-DD HH:mm:ss');
  searchParam.end = searchParam.endDate ? searchParam.endDate : moment().format('YYYY-MM-DD HH:mm:ss');

  await getMonitoringDetailAPI(searchParam).then((res) => {
    const { data } = res;
    const { contents } = data;
    if (contents) {
      const groupJobsList = state.groupJobsList || [];
      [...groupJobsList].forEach((v) => {
        if (v.id === searchParam.id) {
          v.chartData = setMonitoringListDataFactory(contents);
        }
      });

      commit('setGroupJobsList', [...groupJobsList]);
    } else {
      commit('setGroupJobsList', []);
    }
  });
};
