import {
  BoardState, BoardSearchParam, NoticeBoard, NoticePost,
} from '@/store/type';
import { RespBoardState } from '@/api/type';

export const setDashboardNoticeBoard = (state: BoardState, noticeList: RespBoardState[]): void => {
  state.dashBoardNoticeBoardList = noticeList;
};

export const setSeachParam = (state: BoardState, searchParam: BoardSearchParam): void => {
  state.searchParam = {
    ...state.searchParam,
    ...searchParam,
  };
};

export const setNoticeBoard = (state: BoardState, notice: NoticeBoard): void => {
  state.noticeBoard = notice;
};

export const setNoticePost = (state: BoardState, post: NoticePost): void => {
  state.noticePost = post;
};
