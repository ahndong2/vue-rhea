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
  MINUTES: [
    { label: '5분', value: 5 },
    { label: '10분', value: 10 },
    { label: '30분', value: 30 },
    { label: '1시간', value: 60 },
  ],
  HOURS: [
    { label: '2시간', value: 2 },
    { label: '3시간', value: 3 },
    { label: '5시간', value: 5 },
    { label: '6시간', value: 6 },
    { label: '8시간', value: 8 },
    { label: '12시간', value: 12 },
  ],
  DAYS: [
    { label: '2일', value: 2 },
    { label: '3일', value: 3 },
    { label: '5일', value: 5 },
    { label: '7일', value: 7 },
  ],
};

const ALERT_LEVEL = {
  1: '심각',
  2: '경고',
  3: '주의',
  4: '해제',
  5: '미해제',
};

export { SELECT_OPTIONS, ALERT_LEVEL };
