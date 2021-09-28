import API, { AxiosResponse } from '../index-instance';

export const getNoticeBoardList = (param): Promise<AxiosResponse> => API.request({
  method: 'GET',
  url: 'board/400/list',
  params: param,
});
