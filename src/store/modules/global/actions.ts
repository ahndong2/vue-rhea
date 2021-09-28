import { ActionContext } from 'vuex';
import { getAuthInfoAPI } from '@/api/global';
import { GlobalState, RootState } from '@/store/type';

export const getAuthInfo = async ({ commit, state }: ActionContext<GlobalState, RootState>): Promise<void> => {
  await getAuthInfoAPI().then((res) => {
    // if (!res) {
    //   commit('setUserInfo', {
    //     department: 'department',
    //     name: 'name',
    //     position: 'position',
    //     roleList: [
    //       {
    //         description: 'ADMIN',
    //         id: 0,
    //         name: 'ADMIN',
    //         status: 'ACTIVE',
    //       }],
    //   });
    // }
    const { data } = res;
    commit('setUserInfo', data.contents);
  });
};

export const setSpinner = ({ commit }: ActionContext<GlobalState, RootState>, spinner):void => {
  commit('setSpinner', spinner);
};
