const SELECT_OPTIONS = {
  REFRESH_TIME: [
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
    { label: '2일간', value: 2 },
    { label: '3일간', value: 3 },
    { label: '5일간', value: 5 },
    { label: '7일간', value: 7 },
  ],
  ALERT_LEVEL: [
    { label: '해제', value: 0, class: 'resolved' },
    { label: '주의', value: 1, class: 'caution' },
    { label: '경고', value: 2, class: 'warning' },
    { label: '심각', value: 3, class: 'danger' },
    { label: '미해제', value: 4, class: 'unresolved' },
  ],
};

export { SELECT_OPTIONS };
