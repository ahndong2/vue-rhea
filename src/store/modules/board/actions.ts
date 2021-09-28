import { ActionContext } from 'vuex';
import { BoardState, RootState } from '@/store/type';
import { getNoticeBoardList } from '@/api/board';

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
