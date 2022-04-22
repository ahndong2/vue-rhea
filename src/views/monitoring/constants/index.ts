const SELECT_OPTIONS = {
  REFRESH_TIME: [
    { label: '5초', value: 5 },
    { label: '10초', value: 10 },
    { label: '30초', value: 30 },
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
    { label: '최근 24시간', value: 24 },
  ],
  ALERT_LEVEL: [
    { label: '주의', value: 1 },
    { label: '경고', value: 2 },
    { label: '심각', value: 3 },
  ],
  TYPE: [
    { label: 'CPU', value: 'CPU' },
    { label: 'Memory', value: 'Memory' },
    { label: 'Storage', value: 'Storage' },
    { label: 'NetworkReception', value: 'NetworkReception' },
    { label: 'Node', value: 'Node' },
    { label: 'Pod', value: 'Pod' },
    { label: 'PodError', value: 'PodError' },
  ],
};

const CHART_COLORS = [
  'rgb(75, 192, 192)',
  'rgb(255, 99, 132)',
  'rgb(255, 159, 64)',
  'rgb(255, 205, 86)',
  'rgb(75, 192, 192)',
  'rgb(54, 162, 235)',
  'rgb(153, 102, 255)',
  'rgb(201, 203, 207)',
];

export { SELECT_OPTIONS, CHART_COLORS };
