const MENU_INFO = {
  HOME: {
    name: 'home',
    backOffice: false,
    class: 'menu-01',
    resourceUrl: '/',
  },
  EVENT: {
    name: '이벤트',
    backOffice: false,
    class: 'menu-03',
  },
  MONITIORING: {
    name: '모니터링',
    backOffice: false,
    class: 'menu-04',
  },
  NOTICE: {
    name: '공지사항',
    backOffice: false,
    class: 'menu-02',
  },
  ADMIN: {
    name: 'Admin',
    backOffice: true,
    class: 'menu-06',
  },
  PASSWORD: {
    name: 'PW변경',
    backOffice: true,
    class: 'menu-06',
  },
  LOGOUT: {
    name: '로그아웃',
    backOffice: true,
    class: 'menu-06',
  },
};

export {
  MENU_INFO,
};
