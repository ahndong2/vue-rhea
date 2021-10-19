import { ActionContext } from 'vuex';
import { getAuthInfoAPI, getMenuListAPI } from '@/api/global';
import { GlobalState, RootState, Menu } from '@/store/type';

export const getAuthInfo = async ({ commit }: ActionContext<GlobalState, RootState>): Promise<void> => {
  await getAuthInfoAPI().then((res) => {
    const { data } = res;
    commit('setUserInfo', data.contents);
  });
};

export const setSpinner = ({ commit }: ActionContext<GlobalState, RootState>, spinner):void => {
  commit('setSpinner', spinner);
};

export const getMenuList = async ({ commit }: ActionContext<GlobalState, RootState>): Promise<void> => {
  await getMenuListAPI().then((res) => {
    const { data } = res;
    const menuList = [] as Menu[];
    if (data.contents.length > 0) {
      Object.keys(data.contents[0].menuVos).forEach((v) => {
        const menu = data.contents[0].menuVos[v][0] as Menu;
        menuList.push(menu);
      });
    }
    commit('setMenuListOrigin', menuList);
  });
};
