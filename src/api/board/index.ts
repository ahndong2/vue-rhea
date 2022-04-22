import API, { AxiosResponse } from '../index-instance';

// 게시글 조회
export const getNoticeBoardList = (param): Promise<AxiosResponse> => API.request({
  method: 'GET',
  url: 'board/400/list',
  params: param,
});

// 게시글 조회 (dashboard)
export const getDashboardNoticeList = (param): Promise<AxiosResponse> => API.request({
  method: 'GET',
  url: 'board/list',
  params: param,
});

// 게시글 등록
export const setNoticeWriteAPI = (data): Promise<AxiosResponse> => API.request({
  method: 'POST',
  url: 'board/400/write',
  data,
});

// 게시글 상세
export const getNoticePostAPI = (param): Promise<AxiosResponse> => API.request({
  method: 'GET',
  url: 'board/400/post',
  params: {
    postId: param,
  },
});

// 게시글 수정
export const setNoticeEditAPI = (data): Promise<AxiosResponse> => API.request({
  method: 'POST',
  url: 'board/400/edit',
  data,
});

// 댓글 조회
export const getCommentsAPI = (param): Promise<AxiosResponse> => API.request({
  method: 'GET',
  url: 'board/400/comments',
  params: {
    postId: param,
  },
});

// 댓글 등록
export const setCommentAPI = (data): Promise<AxiosResponse> => API.request({
  method: 'POST',
  url: 'board/400/comment/write',
  data,
});

// 댓글 삭제
export const deleteCommentAPI = (data): Promise<AxiosResponse> => API.request({
  method: 'DELETE',
  url: 'board/400/comment/delete',
  data,
});

// 댓글 수정
export const editCommentAPI = (data): Promise<AxiosResponse> => API.request({
  method: 'POST',
  url: 'board/400/comment/edit',
  data,
});
