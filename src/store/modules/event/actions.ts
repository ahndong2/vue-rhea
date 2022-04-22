import { ActionContext } from 'vuex';
import moment from 'moment';
import {
  EventState, RootState, EventSearchParam, EventLog, GroupInfo, AlarmGroupUser,
} from '@/store/type';
import {
  getAlertStatusListAPI,
  getOrgMonitoringListAPI, getDataSourceList,
  getEventListAPI, getEventDetailListAPI, getEventIgnoreReasonAPI,
  setEventIgnoreWriteAPI, setEventIgnoreCanclewriteAPI,
  getImpactFlowAPI, setImpactFlowAPI,
  getUnknownResourceListAPI, getUnknownResourceCountAPI, getAlarmGroupUserListAPI,
  getUnknownDataSourceListAPI,
} from '@/api/event';

// Organization 조회
export const getOrgData = async ({ commit }: ActionContext<EventState, RootState>): Promise<void> => {
  await getOrgMonitoringListAPI().then((res) => {
    const { data } = res;
    const { contents } = data;
    // selectbox 에 맞춤
    const organizationList = contents.map((v) => ({
      id: v.id,
      label: v.name,
      value: v.id,
      childOrganizations: v.childOrganizations,
      prometheuses: v.prometheuses,
    }));
    commit('setOrganizationList', organizationList);
  });
};

// Datasource 조회
interface SelectDefault {
  id?: string;
  label?:string;
  value?:string;
}
interface TypeDataSource extends SelectDefault{
  groupinfo?: GroupInfo[]
}
export const getDataSource = async (): Promise<TypeDataSource[]> => {
  let dataSourceList = [] as TypeDataSource[];
  await getDataSourceList().then((res) => {
    const { data } = res;
    const { contents } = data;
    // selectbox 에 맞춤
    dataSourceList = contents.map((v) => ({
      id: v.id,
      label: v.name,
      value: v.id,
      groupinfo: v.groupinfo,
    })) as TypeDataSource[];
  });
  return dataSourceList;
};

// alert status 조회
export const getAlertStatusData = async ({ commit, state }: ActionContext<EventState, RootState>, type:number): Promise<void> => {
  const occurredFrom = state.occurred?.searchDuring === 999 ? ''
    : moment().add(`-${state.occurred?.searchDuring}`, 'minutes').format('YYYY-MM-DD HH:mm:ss');
  const unresolvedFrom = moment().add(`-${state.unresolved?.searchDuring}`, 'minutes').format('YYYY-MM-DD HH:mm:ss');
  const param = type === 1 ? { startDate: occurredFrom, eventType: type } : { startDate: unresolvedFrom, eventType: type };

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
    if (type === 1) {
      commit('setOccurredAlertStatusData', content || {});
    } else {
      commit('setUnresolvedAlertStatusData', content || {});
    }
  });
};

// 발생 Event 조회
export const getEventOccurredData = async ({ commit, state }: ActionContext<EventState, RootState>): Promise<void> => {
  const occurredFrom = state.occurred?.searchDuring === 999 ? ''
    : moment().add(`-${state.occurred?.searchDuring}`, 'minutes').format('YYYY-MM-DD HH:mm:ss');
  const param = {
    ...state.occurred,
    from: occurredFrom,
  };

  await getEventListAPI(param).then((res) => {
    const { data } = res;
    const { content, pageable, totalElements } = data.contents;

    if (content.length > 0) {
      content.forEach((v) => {
        v.key = v['@id'];
      });
    }
    commit('setEventOccurredList', content || []);

    const searchData = {
      ...state.occurred,
      page: pageable.pageNumber + 1,
      totalCount: totalElements,
    };

    commit('setOccurred', searchData);
  });
};

// 발생 Event Detail 조회
interface DetailRtn {
  status?: number;
  searchData?: EventSearchParam,
  eventListData?: EventLog[]
}

export const getEventDetailList = async (actions: ActionContext<EventState, RootState>, searchParam): Promise<DetailRtn> => {
  const rtn = {
    searchData: {}, eventListData: [],
  };
  await getEventDetailListAPI(searchParam).then((res) => {
    const { data } = res;
    const { content, pageable, totalElements } = data.contents;

    const paging = {
      page: pageable.pageNumber + 1,
      totalCount: totalElements,
    };
    rtn.searchData = paging;
    rtn.eventListData = content;
  });
  return rtn;
};

// 해제 Event 조회
export const getEventUnresolvedData = async ({ commit, state }: ActionContext<EventState, RootState>): Promise<void> => {
  const unresolvedFrom = moment().add(`-${state.unresolved?.searchDuring}`, 'minutes').format('YYYY-MM-DD HH:mm:ss');
  const param = {
    ...state.unresolved,
    from: unresolvedFrom,
    searchType: 'c',
  };
  await getEventListAPI(param).then((res) => {
    const { data } = res;
    const { content, pageable, totalElements } = data.contents;

    commit('setEventUnresolvedList', content || []);

    const searchData = {
      ...state.unresolved,
      page: pageable.pageNumber + 1,
      totalCount: totalElements,
    };
    commit('setUnresolved', searchData);
  });
};

// 예외 Event 조회
export const getEventIgnoreData = async ({ commit, state }: ActionContext<EventState, RootState>): Promise<void> => {
  const param = {
    ...state.ignore,
    searchType: 'i',
  };
  await getEventListAPI(param).then((res) => {
    const { data } = res;
    const { content, pageable, totalElements } = data.contents;

    if (content.length > 0) {
      content.forEach((v) => {
        v.key = `${v.groupId}_${v.thresholdResourceType}_${v.resourceVal}`;
      });
    }
    commit('setEventIgnoreList', content || []);

    const searchData = {
      ...state.ignore,
      page: pageable.pageNumber + 1,
      totalCount: totalElements,
    };
    commit('setIgnore', searchData);
  });
};

// Event Reason 가져오기
export const getEventIgnoreReasonData = async ({ commit }: ActionContext<EventState, RootState>, param): Promise<void> => {
  await getEventIgnoreReasonAPI(param).then((res) => {
    const { data } = res;
    commit('setEventIgnoreReason', data.contents[0] || null);
  });
};

// Event 예외 처리
export const setEventIgnoreWrite = async ({ dispatch }: ActionContext<EventState, RootState>, param): Promise<void> => {
  await setEventIgnoreWriteAPI(param).then((res) => {
    const { data } = res;
    if (data.httpStatus === 200) {
      window.alert('저장되었습니다.');
      dispatch('getEventOccurredData');
    } else {
      window.alert(`[${data.httpStatus}]API 오류 : ${data.message}`);
    }
  });
};

// Event 예외 취소 처리
export const setEventIgnoreCanclewrite = async ({ dispatch }: ActionContext<EventState, RootState>, param): Promise<void> => {
  await setEventIgnoreCanclewriteAPI(param).then((res) => {
    const { data } = res;
    if (data.httpStatus === 200) {
      window.alert('저장되었습니다.');
      dispatch('getEventIgnoreData');
    } else {
      window.alert(`[${data.httpStatus}]API 오류 : ${data.message}`);
    }
  });
};

// Event 상태 조회
export const getImpactFlow = async ({ commit }: ActionContext<EventState, RootState>, param) => {
  await getImpactFlowAPI(param).then((res) => {
    const { data } = res;
    data.contents.impactFlowLog.reverse();
    commit('setImpactFlowData', data.contents || {});
  });
};

// Event 상태 update
export const setImpactFlow = async ({ dispatch }: ActionContext<EventState, RootState>, param): Promise<void> => {
  await setImpactFlowAPI(param).then((res) => {
    const { data } = res;
    if (data.httpStatus === 200) {
      window.alert('저장되었습니다.');
      if (param.statusType === 0) {
        dispatch('getEventOccurredData');
      } else {
        dispatch('getEventUnresolvedData');
      }
    } else {
      window.alert(`[${data.httpStatus}]API 오류 : ${data.message}`);
    }
  });
};

// Event 미등록 조회
export const getUnknownList = async ({ commit, state }: ActionContext<EventState, RootState>, param): Promise<void> => {
  await getUnknownResourceListAPI(param).then((res) => {
    const { data } = res;
    if (data.httpStatus === 200) {
      const { content, pageable, totalElements } = data.contents;

      commit('setUnknownList', content || []);

      const searchData = {
        ...state.unknown,
        page: pageable.pageNumber + 1,
        totalCount: totalElements,
      };
      commit('setUnknown', searchData);
    } else {
      window.alert(`[${data.httpStatus}]API 오류 : ${data.message}`);
    }
  });
};

// 미등록 카운트 조회
export const getUnknownCount = async ({ commit }: ActionContext<EventState, RootState>): Promise<void> => {
  await getUnknownResourceCountAPI().then((res) => {
    const { data } = res;
    if (data.httpStatus === 200) {
      commit('setUnknownCount', data.contents);
    } else {
      window.alert(`[${data.httpStatus}]API 오류 : ${data.message}`);
    }
  });
};

// 알림 대상자 연락처 조회
export const getAlarmGroupUser = async (actions: ActionContext<EventState, RootState>, id): Promise<AlarmGroupUser[]> => {
  let rtn = [] as AlarmGroupUser[];
  await getAlarmGroupUserListAPI({ groupInfoId: id }).then((res) => {
    const { data } = res;
    if (data.httpStatus === 200) {
      const content = data.contents;
      let groupCnt = 0;
      content.forEach((v, i) => {
        if (i === 0) return;
        const prev = data.contents[i - 1];
        // if (v.organizationName + v.groupName !== prev.organizationName + prev.groupName) {
        if (v.groupName !== prev.groupName) {
          groupCnt++;
        }

        v.groupNameCount = groupCnt;
      });
      rtn = content || [] as TypeDataSource[];
    } else {
      window.alert(`[${data.httpStatus}]API 오류 : ${data.message}`);
    }
  });
  return rtn;
};

// 미등록 등록 팝업 orglist
export const getUnknownDataSourceList = async ({ commit }: ActionContext<EventState, RootState>, param) => {
  await getUnknownDataSourceListAPI(param).then((res) => {
    const { data } = res;
    commit('setUnknownDataSourceList', data.contents || []);
  });
};
