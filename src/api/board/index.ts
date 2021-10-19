import API, { AxiosResponse } from '../index-instance';

export const getNoticeBoardList = (param): Promise<AxiosResponse> => API.request({
  method: 'GET',
  url: 'board/400/list',
  params: param,
});

export const setNoticeWriteAPI = (data): Promise<AxiosResponse> => API.request({
  method: 'POST',
  url: 'board/400/write',
  data,
});

export const getNoticePostAPI = (param): Promise<AxiosResponse> => API.request({
  method: 'GET',
  url: 'board/400/post',
  params: {
    postId: param,
  },
});

export const setNoticeEditAPI = (data): Promise<AxiosResponse> => API.request({
  method: 'POST',
  url: 'board/400/edit',
  data,
});
