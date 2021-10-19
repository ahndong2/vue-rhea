import { ActionContext } from 'vuex';
import { BoardState, RootState } from '@/store/type';
import {
  getNoticeBoardList, setNoticeWriteAPI, getNoticePostAPI, setNoticeEditAPI,
} from '@/api/board';
import router from '@/router';

export const getDashboardNoticeBoard = async ({ commit }:ActionContext<BoardState, RootState>): Promise<void> => {
  await getNoticeBoardList(null).then((res) => {
    const { data } = res;
    const { contents } = data || { content: [] };

    commit('setDashboardNoticeBoard', contents.content.slice(0, 5));
  });
};

export const getNoticeBoard = async ({ commit, state }:ActionContext<BoardState, RootState>): Promise<void> => {
  const param = state.searchParam;
  await getNoticeBoardList(param).then((res) => {
    const { data } = res;
    const { contents } = data || { content: [] };

    commit('setNoticeBoard', contents);
  });
};

export const setNoticeWrite = async ({ dispatch }: ActionContext<BoardState, RootState>, param): Promise<void> => {
  await setNoticeWriteAPI(param).then((res) => {
    const { data } = res;
    if (data.httpStatus === 200) {
      window.alert('저장되었습니다.');
      router.push({ name: 'NoticeList' });
    } else {
      window.alert(`[${data.httpStatus}]API 오류 : ${data.message}`);
    }
  });
};

export const getNoticePost = async ({ commit }:ActionContext<BoardState, RootState>, param): Promise<void> => {
  await getNoticePostAPI(param).then((res) => {
    const { data } = res;
    const { contents } = data || { content: [] };

    commit('setNoticePost', contents);
  });
};

export const setNoticeEdit = async ({ dispatch }: ActionContext<BoardState, RootState>, param): Promise<void> => {
  await setNoticeEditAPI(param).then((res) => {
    const { data } = res;
    if (data.httpStatus === 200) {
      window.alert('저장되었습니다.');
      router.push({ name: 'NoticeList' });
    } else {
      window.alert(`[${data.httpStatus}]API 오류 : ${data.message}`);
    }
  });
};
