import { ActionContext } from 'vuex';
import { getAuthInfoAPI, getMenuListAPI } from '@/api/global';
import { GlobalState, RootState, Menu } from '@/store/type';

export const getAuthInfo = async ({ commit }: ActionContext<GlobalState, RootState>): Promise<void> => {
  await getAuthInfoAPI().then((res) => {
    const { data } = res;
    commit('setUserInfo', data.contents);
  });
};

export const setAPIRequestCount = ({ commit, state }: ActionContext<GlobalState, RootState>):void => {
  commit('setAPIRequestCount', state.apiRequestCount as number + 1);
  commit('setSpinner', true);
};

export const setAPIResponseCount = ({ commit, state }: ActionContext<GlobalState, RootState>):void => {
  commit('setAPIResponseCount', state.apiResponseCount as number + 1);

  if (state.apiRequestCount === state.apiResponseCount) {
    commit('resetAPICountSpinner');
  }
};

let errorFlag = false;
export const errorControll = ():void => {
  if (!errorFlag) {
    errorFlag = true;
    window.alert('로그인 세션 타임이 종료되었습니다. \n로그인 페이지로 이동합니다.');
    window.location.href = '/';
  }
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
