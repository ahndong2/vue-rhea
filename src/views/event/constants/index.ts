const SELECT_OPTIONS = {
  REFRESH_TIME: [
    // { label: '5초', value: 5 },
    // { label: '10초', value: 10 },
    // { label: '30초', value: 30 },
    { label: '1분', value: 60 },
    { label: '5분', value: 300 },
    { label: '15분', value: 900 },
    { label: '30분', value: 1800 },
    { label: '1시간', value: 3600 },
  ],
  SEARCH_DURING: [
    { label: '최근 1시간', value: 1 },
    { label: '최근 2시간', value: 2 },
    { label: '최근 3시간', value: 3 },
    { label: '최근 5시간', value: 5 },
    { label: '최근 6시간', value: 6 },
    { label: '최근 8시간', value: 8 },
    { label: '최근 12시간', value: 12 },
    { label: '최근 1일', value: 24 },
    { label: '최근 2일', value: 48 },
    { label: '최근 3일', value: 72 },
    { label: '최근 5일', value: 120 },
    { label: '최근 7일', value: 168 },
    { label: '전체', value: 999 },
  ],
  ALERT_LEVEL: [
    { label: '주의', value: 1 },
    { label: '경고', value: 2 },
    { label: '심각', value: 3 },
    // { label: '해제', value: 4 },
    // { label: '미해제', value: 0 },
  ],
};

export { SELECT_OPTIONS };
