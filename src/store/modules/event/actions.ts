import { ActionContext } from 'vuex';
import moment from 'moment';
import { EventState, RootState } from '@/store/type';
import {
  getAlertStatusListAPI, getEventList, getEventIgnoreReason,
  setEventIgnoreWriteAPI, setEventIgnoreCanclewriteAPI,
} from '@/api/event';
import { getOrgMonitoringListAPI } from '@/api/dashboard';

// Organization 조회
export const getOrgData = async ({ commit }: ActionContext<EventState, RootState>): Promise<void> => {
  await getOrgMonitoringListAPI().then((res) => {
    const { data } = res;
    const { contents } = data;

    // selectbox 에 맞춤
    const orgList = contents.map((v) => ({
      id: v.id,
      label: v.name,
      value: v.name,
    }));
    commit('setOrgList', orgList);
  });
};

// alert status 조회
export const getAlertStatusData = async ({ commit, state }: ActionContext<EventState, RootState>, type:number): Promise<void> => {
  const occurredFrom = state.occurred?.searchDuring === 999 ? '' : moment().add(`-${state.occurred?.searchDuring}`, 'hours').format('YYYY-MM-DD HH:mm:ss');
  const unresolvedFrom = moment().add(`-${state.unresolved?.searchDuring}`, 'hours').format('YYYY-MM-DD HH:mm:ss');
  const param = type === 1 ? { ...state.occurred, startDate: occurredFrom, eventType: type } : { ...state.unresolved, startDate: unresolvedFrom, eventType: type };

  await getAlertStatusListAPI(param).then((res) => {
    const { data } = res;
    if (type === 1) {
      commit('setOccurredAlertStatusData', data.contents || []);
    } else {
      commit('setUnresolvedAlertStatusData', data.contents || []);
    }
  });
};

// 발생 Event 조회
export const getEventOccurredData = async ({ commit, state }: ActionContext<EventState, RootState>): Promise<void> => {
  const occurredFrom = state.occurred?.searchDuring === 999 ? '' : moment().add(`-${state.occurred?.searchDuring}`, 'hours').format('YYYY-MM-DD HH:mm:ss');
  const param = {
    ...state.occurred,
    from: occurredFrom,
  };

  await getEventList(param).then((res) => {
    const { data } = res;
    const { content, pageable, totalElements } = data.contents;

    commit('setEventOccurredList', content || []);

    const searchData = {
      ...state.occurred,
      page: pageable.pageNumber + 1,
      totalCount: totalElements,
    };
    commit('setOccurred', searchData);
  });
};

// 해제 Event 조회
export const getEventUnresolvedData = async ({ commit, state }: ActionContext<EventState, RootState>): Promise<void> => {
  const unresolvedFrom = moment().add(`-${state.unresolved?.searchDuring}`, 'hours').format('YYYY-MM-DD HH:mm:ss');
  const param = {
    ...state.unresolved,
    from: unresolvedFrom,
    searchType: 'c',
  };
  await getEventList(param).then((res) => {
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
  await getEventList(param).then((res) => {
    const { data } = res;
    const { content, pageable, totalElements } = data.contents;

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
  await getEventIgnoreReason(param).then((res) => {
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
