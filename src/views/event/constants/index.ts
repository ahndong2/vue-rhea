const EVENT_TAB = [
  { key: 'Occurred', value: '발생' },
  { key: 'Unresolved', value: '해제' },
  { key: 'Ignore', value: '예외' },
  { key: 'Unknown', value: '미등록' },
];

const EVENT_DETAIL_TAB = [
  { key: 'Detail', value: '이벤트 로그' },
  { key: 'Alarm', value: '알림 대상자' },
];

const SELECT_OPTIONS = {
  REFRESH_TIME: [
    { label: '1분', value: 60 },
    { label: '5분', value: 300 },
    { label: '15분', value: 900 },
    { label: '30분', value: 1800 },
    { label: '1시간', value: 3600 },
  ],
  // 발생: 5분 ~ 24시간, 전체
  // 해제: 1시간 ~ 3일
  SEARCH_DURING: [
    { label: '최근 5분', value: 5 },
    { label: '최근 10분', value: 10 },
    { label: '최근 15분', value: 15 },
    { label: '최근 20분', value: 20 },
    { label: '최근 30분', value: 30 },
    { label: '최근 1시간', value: 60 },
    { label: '최근 2시간', value: 120 },
    { label: '최근 3시간', value: 180 },
    { label: '최근 5시간', value: 300 },
    { label: '최근 6시간', value: 360 },
    { label: '최근 8시간', value: 480 },
    { label: '최근 12시간', value: 720 },
    { label: '최근 24시간', value: 1440 },
    { label: '최근 2일', value: 2880 },
    { label: '최근 3일', value: 4320 },
    { label: '전체', value: 999 },
  ],
  ALERT_LEVEL: [
    { label: '주의/경고/심각', value: 0, class: 'resolved' },
    { label: '주의', value: 1, class: 'caution' },
    { label: '경고', value: 2, class: 'warning' },
    { label: '심각', value: 3, class: 'danger' },
  ],
  STATUS: [
    { label: '발생', value: 'G' },
    { label: '연락완료', value: 'OP' },
    { label: '조치중', value: 'I' },
    { label: '반려', value: 'C' },
    { label: '오탐', value: 'N' },
    { label: '해제', value: 'R' },
    { label: '미확인 해제', value: 'NR' },
  ],
};

const NO_HIERARCHY = { id: '-1', label: 'Org 하위 미선택', value: '-1' };
export {
  EVENT_TAB, EVENT_DETAIL_TAB, NO_HIERARCHY, SELECT_OPTIONS,
};
