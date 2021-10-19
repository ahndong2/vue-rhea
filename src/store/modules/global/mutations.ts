import { GlobalState, UserInfo } from '@/store/type';

export const setUserInfo = (state: GlobalState, userInfo?: UserInfo): void => {
  state.userInfo = {
    ...state.userInfo,
    ...userInfo,
  };
};

export const setSpinner = (state: GlobalState, data: boolean) => {
  state.spinner = data;
};

export const setMenuListOrigin = (state: GlobalState, data) => {
  state.menuListOrigin = data;
};

export const setMenuList = (state: GlobalState, data) => {
  state.menuList = data;
};
