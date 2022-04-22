import { ActionContext } from 'vuex';
import {
  getAlertStatusListAPI,
  getOrgMonitoringListAPI,
  getGroupJobsListAPI, getMonitoringDetailAPI,
} from '@/api/monitoring';
import {
  MonitoringState, SearchData, RootState,
} from '@/store/type';
import { setMonitoringListDataFactory } from '@/utils/data';
import moment from 'moment';

export const getAlertStatusData = async ({ commit, state }: ActionContext<MonitoringState, RootState>, searchParam): Promise<void> => {
  const param = {
    ...searchParam,
    startDate: searchParam.startDate ? searchParam.startDate : moment().add(`-${state.searchData?.searchDuring}`, 'hours').format('YYYY-MM-DD HH:mm:ss'),
    endDate: searchParam.endDate ? searchParam.endDate : moment().format('YYYY-MM-DD HH:mm:ss'),
    organizationId: searchParam.organizationId,
    prometheusId: searchParam.prometheusId || 0,
    eventType: 0,
  };

  await getAlertStatusListAPI(param).then((res) => {
    const { data } = res;
    const content = { ...data.contents };
    if (content?.CUSTOM_PROMQL && content?.CUSTOM_PROMQL.length > 0) {
      content.customPromQLList = {};
      content.CUSTOM_PROMQL.forEach((v) => {
        const d = Object.keys(v.resourceList)[0];
        content.customPromQLList[d] = { name: d.replace('_', ' '), searchType: d };
      });
    }

    commit('setAlertStatusList', content);
  });
};

export const getOrgListData = async ({ commit }: ActionContext<MonitoringState, RootState>): Promise<void> => {
  await getOrgMonitoringListAPI().then((res) => {
    const { data } = res;
    const { contents } = data;
    // selectbox 에 맞춤
    const orgData = contents.filter((org) => org.id !== 100).map((v) => ({
      id: v.id,
      label: v.name,
      value: v.id,
      childOrganizations: v.childOrganizations,
      prometheuses: v.prometheuses,
    }));
    commit('setOrganizationList', orgData);
  });
};

export const getPrometheusList = ({ commit, state }: ActionContext<MonitoringState, RootState>, orgId:string): void => {
  const prometheus = state.organizationList?.filter(((v) => String(v.id) === String(orgId)))[0].prometheuses;
  const prometheusList = prometheus?.map((v) => ({
    id: v.id,
    label: v.name,
    value: v.id,
    groupinfo: v.groupinfo,
  }));

  commit('setPrometheusList', prometheusList);
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

    const activeType = contents.installationType === 'K8s' ? 'K8S' : 'RESOURCE';
    commit('setGroupJobsList', contents.groupinfo || []);
    commit('setPrometheusInfo', prometheusInfo);
    commit('setActiveType', activeType);
    // commit('setMonitoringData', null);
  });
};

export const getMonitoringDetailUnit = async ({ commit, state }: ActionContext<MonitoringState, RootState>, searchParam:SearchData): Promise<void> => {
  searchParam.start = searchParam.startDate ? searchParam.startDate : moment().add(`-${state.searchData?.searchDuring}`, 'hours').format('YYYY-MM-DD HH:mm:ss');
  searchParam.end = searchParam.endDate ? searchParam.endDate : moment().format('YYYY-MM-DD HH:mm:ss');

  await getMonitoringDetailAPI(searchParam).then((res) => {
    const { data } = res;
    const { contents } = data;
    if (contents) {
      const key = searchParam.key;
      if (!key) return;
      const listData = setMonitoringListDataFactory(contents, state.activeType);
      const content = { data: listData[key] || [], key };

      commit('setMonitoringDataUnit', content);
    }
  });
};

export const getMonitoringDetail = async ({ commit, state }: ActionContext<MonitoringState, RootState>, searchParam:SearchData): Promise<void> => {
  searchParam.start = searchParam.startDate ? searchParam.startDate : moment().add(`-${state.searchData?.searchDuring}`, 'hours').format('YYYY-MM-DD HH:mm:ss');
  searchParam.end = searchParam.endDate ? searchParam.endDate : moment().format('YYYY-MM-DD HH:mm:ss');

  await getMonitoringDetailAPI(searchParam).then((res) => {
    const { data } = res;
    const { contents } = data;
    if (contents) {
      const listData = setMonitoringListDataFactory(contents, state.activeType);
      const content = { ...listData };
      Object.keys(content).forEach((key) => {
        if (!content[key]) delete content[key];
      });

      commit('setMonitoringData', content);
    }
  });
};
