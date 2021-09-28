// board
interface Board {
  description?: string;
  id?: number;
  name?: string;
  regDate?: number;
  [key:string]: unknown;
}
interface Notice {
  id?: number;
  board?: Board;
  titme?: string;
  regDate?: number;
  updateDate?: number;
  [key:string]: unknown;
}
interface BoardSearchParam {
  page?: number;
  size?: number;
  paged?: number;
}
interface NoticeBoard {
  content : Array<Notice>,
  totalElements : number;
}
interface BoardState {
  dashBoardNoticeBoardList?: Array<Notice>;
  noticeBoard?: NoticeBoard;
  searchParam?: BoardSearchParam;
}

// global
interface UserInfo {
  department?: string;
  email?: string;
  id?: number;
  lastLoginDate?: string
  lastPasswordModifyDate?: string;
  loginId?: string;
  name?: string;
  position?: string;
  regDate?: string;
  [key:string]: unknown;
}

interface AlertObj {
  minute?: number|string;
  day?: number|string;
  hour?: number|string;
  refreshTime?: number|string;
  startDate?: number|string;
  endDate?: number|string;
}

interface GlobalState {
  userInfo?: UserInfo;
  spinner? : boolean;
}

// monitoring
interface GroupInfo{
  creator?: string;
  description?: string;
  groupName?: string;
  id?: number
  jobName?: string;
  modifier?: string;
  modifyDate?: string;
  registDate?: string;
  useYn?: string;
}
interface Prometheus{
  authType?: string;
  creator?: string;
  csp?: string;
  customAuthHeader?: string;
  customAuthHeaderValue?: string;
  description?: string;
  grafanaLink?: string;
  groupinfo?: Array<GroupInfo>;
  id?: number
  installationType?: string;
  modifier?: string;
  modifyDate?: string;
  name?: string;
  registDate?: string;
  tlsAuthCaCert?: string;
  tlsAuthClientCert?: string;
  tlsAuthClientKey?: string;
  tlsAuthDomain?: string;
  url?: string;
  useYn?: string;
  userId?: string;
  userPw?: string;
}
interface OrgMonitoringList {
  creator?: string;
  description?: string;
  id?: number
  modifier?: string;
  modifyDate?: string;
  name?: string;
  prometheuses?: Array<Prometheus>;
  registDate?: string;
  useYn?: string;
}
interface SummaryType {
  label?: string;
  count?: number;
  [key:string]: unknown;
}
interface DashboardState {
  alert?: AlertObj;
  currentTime?: number;
  beforeMinutes?: number;
  beforeHours?: number;
  beforeDays?: number;
  alertSummaryMinute?: Array<SummaryType>;
  alertSummaryTime?:Array<SummaryType>;
  dayUnresolvedCnt?:number;
  totalUnresolvedCnt?:number;
  orgMonitoringList?: [];
}

interface EventSearchParam {
  refreshTime?: number;
  searchDuring?: number;
  organizationName?: string;
  prometheusName?: string;
  groupJobName?: string;
  alertLevel?: string;
  page?: number;
  size?: number;
  [key:string]: unknown;
}

interface EventLog {
  id?: number;
  organizaionId?: number;
  prometheusId?: number;
  groupId?: number;
  resourceType?: string;
  resourceVal?: string;
  errorType?: string;
  errorDescription?: string;
  alertLevel?: string;
  creator?: string;
  modifier?: string;
  registDate?: string;
  modifyDate?: string;
  recoveryDate?: string;
  alertYN?: string;
  alertDate?: string;
  orgNm?: string;
  prometheusNm?: string;
  groupInfoNm?: string;
  csp?: string;
  [key:string]: unknown;
}

interface EventIgnoreReason {
  id?: number;
  groupId?: number;
  thresholdResourceType?: string;
  ignoreUser?: string;
  ignoreReason?: string;
  ignoreCancleUser?: null;
  ignoreCancleReason?: null;
  ignoreCancleYn?: null;
  ignoreDate?: number;
  ignoreCancleDate?: number;
  creator?: string;
  modifier?: string;
  registDate?: number;
  modifyDate?: number;
}
interface EventState {
  occurred?: EventSearchParam;
  unresolved?: EventSearchParam;
  ignore?: EventSearchParam;
  orgList?: [];
  eventOccurredList: Array<EventLog>;
  eventUnresolvedList : Array<EventLog>;
  eventIgnoreList: Array<EventLog>;
  ignoreReason: EventIgnoreReason;
  occurredAlertStatusData?: [];
  unresolvedAlertStatusData?: [];
}
interface MetricData {
  __name__?: string;
  condition?: string;
  instance?: string;
  nodename?: string;
  job?: string;
  status?: string;
  node?: string;
  phase?: string;
  pod?: string;
}

interface Monitoring {
  metric?: MetricData;
  value?: [];
  values?: [];
}
interface ChartData {
  cpuList?: Monitoring[];
  memoryList?: Monitoring[];
  storageList?: Monitoring[];
  networkReceptionList?: Monitoring[];
  networkSendList?: Monitoring[];
  systemLoadList?: Monitoring[];
  nodeList?: Monitoring[];
  podList?: Monitoring[];
  podErrorList?:Monitoring[];
}
interface MonitoringDetail {
  id?: number;
  name?: string;
  chartData?: ChartData;
  isOpen?: boolean;
  [key:string]: unknown;
}
interface SearchData {
  organizationId?: string;
  prometheusId?: string;
  startDate?: string;
  endDate?: string;
  refreshTime?: number;
  searchDuring?: number;
  [key:string]: unknown;
}
interface MonitoringState {
  searchData?:SearchData;
  alertStatusList?: [];
  organizationList?: [];
  prometheusList?: [];
  groupJobsList?: MonitoringDetail[];
  activeIdx?:number;
  prometheusInfo?: {};
}
// root state
interface RootState {
  board : BoardState,
  global : GlobalState,
  dashboard : DashboardState
  event : EventState,
  monitoring : MonitoringState,
}

export {
  RootState,
  GlobalState, UserInfo,
  DashboardState, SummaryType, OrgMonitoringList, Prometheus, GroupInfo, AlertObj,
  BoardState, Notice, Board, BoardSearchParam, NoticeBoard,
  EventState, EventLog, EventSearchParam,
  MonitoringState, MonitoringDetail, Monitoring, MetricData, ChartData, SearchData,
};
