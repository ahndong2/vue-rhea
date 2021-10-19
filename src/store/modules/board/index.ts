import { BoardState } from '@/store/type';
import * as actions from './actions';
import * as mutations from './mutations';

const state: BoardState = {
  dashBoardNoticeBoardList: [],
  noticeBoard: {
    content: [],
    totalElements: 0,
  },
  searchParam: {
    page: 1,
    size: 10,
    paged: 10,
  },
  noticePost: {
    title: '',
    content: '',
  },
};

export default {
  namespaced: true,
  state,
  actions,
  mutations,
};
