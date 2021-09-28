import API from '../index-instance';

export const getKubeList = (param: string): Promise<any> => API.request({
  method: 'GET',
  url: '/kube/resource/',
  params: {
    name: param,
  },
});
