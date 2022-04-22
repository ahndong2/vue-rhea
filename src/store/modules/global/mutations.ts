import { GlobalState, UserInfo } from '@/store/type';

export const setUserInfo = (state: GlobalState, userInfo?: UserInfo): void => {
  state.userInfo = {
    ...state.userInfo,
    ...userInfo,
  };
};

export const setAPIRequestCount = (state: GlobalState, data: number) => {
  state.apiRequestCount = data;
};

export const setAPIResponseCount = (state: GlobalState, data: number) => {
  state.apiResponseCount = data;
};

export const setSpinner = (state: GlobalState, data: boolean) => {
  state.spinner = data;
};

export const resetAPICountSpinner = (state: GlobalState) => {
  state.apiRequestCount = 0;
  state.apiResponseCount = 0;
  state.spinner = false;
};

export const setMenuListOrigin = (state: GlobalState, data) => {
  state.menuListOrigin = data;
};

export const setMenuList = (state: GlobalState, data) => {
  state.menuList = data;
};

export const setTopBtn = (state: GlobalState, data: boolean) => {
  state.topBtn = data;
};
