import { ActionContext } from 'vuex';
import { BoardState, RootState } from '@/store/type';
import {
  getDashboardNoticeList,
  getNoticeBoardList, setNoticeWriteAPI, getNoticePostAPI, setNoticeEditAPI,
  getCommentsAPI, setCommentAPI, editCommentAPI, deleteCommentAPI,
} from '@/api/board';
import router from '@/router';

export const getDashboardNoticeBoard = async ({ commit }:ActionContext<BoardState, RootState>): Promise<void> => {
  const param = {
    DDayCount: -7,
    boardId: 400,
    page: 1,
    size: 5,
  };
  await getDashboardNoticeList(param).then((res) => {
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

// 게시글 등록
export const setNoticeWrite = async (actions: ActionContext<BoardState, RootState>, param): Promise<void> => {
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

// 게시글 조회
export const getNoticePost = async ({ commit }:ActionContext<BoardState, RootState>, param): Promise<void> => {
  await getNoticePostAPI(param).then((res) => {
    const { data } = res;
    const { contents } = data || { content: [] };

    commit('setNoticePost', contents);
  });
};

// 게시글 수정
export const setNoticeEdit = async (actions: ActionContext<BoardState, RootState>, param): Promise<void> => {
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

// 댓글 조회
export const getComments = async ({ commit }:ActionContext<BoardState, RootState>, param): Promise<void> => {
  await getCommentsAPI(param).then((res) => {
    const { data } = res;
    const { contents } = data || { content: [] };

    commit('setComments', contents.reverse());
  });
};

// 댓글 등록
export const setCommentWrite = async ({ dispatch }: ActionContext<BoardState, RootState>, param): Promise<void> => {
  await setCommentAPI(param).then((res) => {
    const { data } = res;
    if (data.httpStatus === 200) {
      window.alert('저장되었습니다.');
      dispatch('getComments', param.postId);
    } else {
      window.alert(`[${data.httpStatus}]API 오류 : ${data.message} (setCommentWrite)`);
    }
  });
};

// 댓글 삭제
export const deleteComment = async ({ dispatch }: ActionContext<BoardState, RootState>, param): Promise<void> => {
  await deleteCommentAPI(param).then((res) => {
    const { data } = res;
    if (data.httpStatus === 200) {
      window.alert('삭제되었습니다.');
      dispatch('getComments', param.postId);
    } else {
      window.alert(`[${data.httpStatus}]API 오류 : ${data.message} (deleteComment)`);
    }
  });
};

// 댓글 수정
export const editComment = async ({ dispatch }: ActionContext<BoardState, RootState>, param): Promise<void> => {
  await editCommentAPI(param).then((res) => {
    const { data } = res;
    if (data.httpStatus === 200) {
      window.alert('수정되었습니다.');
      dispatch('getComments', param.postId);
    } else {
      window.alert(`[${data.httpStatus}]API 오류 : ${data.message} (editComment)`);
    }
  });
};
