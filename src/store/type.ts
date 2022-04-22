// component
interface SelectBoxType {
  label?: string;
  value?: string;
}
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
interface NoticePost {
  id?: number;
  title: string;
  content: string;
}
interface NoticeComment {
  id: number;
  content: string;
  regDate: number;
}
interface BoardState {
  dashBoardNoticeBoardList?: Array<Notice>;
  noticeBoard?: NoticeBoard;
  searchParam?: BoardSearchParam;
  noticePost?: NoticePost;
  commentList?: Array<NoticeComment>;
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
interface Menu {
  description?: string;
  id?: number;
  name?: string;
  resourceUrl?: string;
  status?: string;
  [key:string]: unknown;
}
interface GlobalState {
  userInfo?: UserInfo;
  spinner? : boolean;
  apiRequestCount? : number;
  apiResponseCount? : number;
  menuListOrigin?: Menu[];
  menuList?: Menu[];
  topBtn?: boolean;
}

// monitoring
interface GroupInfo{
  creator?: string;
  description?: string;
  groupName?: string;
  id?: number
  name?: string;
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
  groupinfoUseYnCnt?: number;
}
interface OrgMonitoringList {
  creator?: string;
  description?: string;
  id?: number
  modifier?: string;
  modifyDate?: string;
  name?: string;
  fullName?: string;
  prometheuses?: Array<Prometheus>;
  registDate?: string;
  useYn?: string;
  prometheusesUseYnCnt?: number;
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
  orgMonitoringNameList?: [];
}

interface Resource {
  CPU?: number;
  Memory?: number;
  Storage?: number;
  NetworkReception?: number;
  Node?: number;
  Pod?: number;
  PodError?: number;
  BlackBox?: number;
  ThreadConnections?: number;
  MaxUsedConnections?: number;
  SelectScan?: number;
  SlowQueries?: number;
  TableLocksImmediate?: number;
  TableLocksWaited?: number;
}
interface AlertStatus {
  TotalResourcesCnt?: number;
  organizationId?: number;
  organizationName?: string;
  prometheusId?: number;
  prometheusName?: string;
  groupId?: number;
  groupName?: string;
  resourceList?: Resource;
}
interface AlertStatusData {
  totalUnconfirmedCnt?: number;
  resourceUnconfirmedCnt?: number;
  nativeUnconfirmedCnt?: number;
  dbUnconfirmedCnt?: number;
  serviceUnconfirmedCnt?: number;
  clearTotalUnconfirmedCnt?: number;
  RESOURCE?: AlertStatus[];
  SERVICE?: AlertStatus[];
  DB?: AlertStatus[];
  NATIVE?: AlertStatus[];
  PROCESS?: AlertStatus[];
  K8S?: AlertStatus[];
  RHEA?: AlertStatus[];
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
  organizationId?: number;
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
  impactFlowId?: number;
  status?: string;
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

interface AlarmGroupUser {
  alertLevel?: string;
  email?: string;
  groupName?: string;
  id?: string;
  organizationName?: string;
  phoneNumber?: string;
  pressureOfBusiness?: string;
  receptionNames?: string;
}

interface UnknownList {
  dataSourceUrl?: string;
  externalLabel?: string;
  groupName?: string;
  id?: number;
  jobName?: string;
  lastCheckDate?: string;
  projectName?: string;
  registDate?: string;
  releaseDate?: string;
  releaseYn?: string;
}
interface ImpactFlowData {
  id?: number;
  status?: string;
  memo?: string;
  solver?: string;
  processingDate?: string;
}
interface UnknownDataSource {
  id?: number;
  name?: string;
  oneDepthOrganizationName?: string;
  twoDepthOrganizationName?: string;
  description?: string;
  prometheusId ?: string;
}
interface EventState {
  occurred?: EventSearchParam;
  unresolved?: EventSearchParam;
  ignore?: EventSearchParam;
  organizationList?: OrgMonitoringList[];
  unknownCount?: number;
  eventOccurredList: Array<EventLog>;
  eventUnresolvedList : Array<EventLog>;
  eventIgnoreList: Array<EventLog>;
  ignoreReason: EventIgnoreReason;
  occurredAlertStatusData?: AlertStatusData;
  unresolvedAlertStatusData?: AlertStatusData;
  impactFlowData?: ImpactFlowData;
  unknownListTable?: UnknownList[];
  unknown?: EventSearchParam;
  unknownDataSourceList?: UnknownDataSource[]
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
interface NodeList {
  readyCount?: number;
  diskPressureCount?: number;
  memoryPressureCount?: number;
  pidPressureCount?: number;
  networkUnavailableCount?: number;
  nodeDisabledList?: Monitoring[];
  nodeAbledList?: Monitoring[];
}
interface PodList {
  pendingCount?: number;
  runningCount?: number;
  succeededCount?: number;
  failedCount?: number;
  unknownCount?: number;
  podDisabledList?: Monitoring[];
  podAbledList?: Monitoring[];
}
interface PodPvStatusList {
  availableCount?: number;
  boundCount?: number;
  releasedCount?: number;
  failedCount?: number;
  pendingCount?: number;
  podAbledList?: Monitoring[];
  podDisabledList?: Monitoring[];
}
interface MonitoringData {
  cpuList?: Monitoring[];
  memoryList?: Monitoring[];
  storageList?: Monitoring[];
  networkReceptionList?: Monitoring[];
  networkSendList?: Monitoring[];
  systemLoadList?: Monitoring[];
  nodeList?: NodeList;
  podList?: PodList;
  podErrorList?: Monitoring[];
  PodPvStatusList?: PodPvStatusList;
  podCpuList?: Monitoring[];
  podMemoryList?: Monitoring[];
}
interface MonitoringDetail {
  id?: number;
  name?: string;
  isOpen?: boolean;
  installationType?: string;
  [key:string]: unknown;
}
interface MonitoringType {
  key?: string;
  name?: string;
  searchType?: string;
}

interface SearchData {
  id?: number;
  organizationId?: string;
  prometheusId?: string;
  startDate?: string;
  endDate?: string;
  start?: string;
  end?: string;
  refreshTime?: number;
  searchDuring?: number;
  monitoringType?: MonitoringType;
  key?: string;
  installationType?: string;
  [key:string]: unknown;
}
interface PrometheusInfo {
  name?: string;
  csp?: string;
  installationType?: string;
  grafanaLink?: string;
  description?: string;
}
interface MonitoringState {
  searchData?:SearchData;
  alertStatusList?: AlertStatusData;
  organizationList?: OrgMonitoringList[];
  prometheusList?: Prometheus[];
  groupJobsList?: MonitoringDetail[];
  activeIdx?:number;
  prometheusInfo?: PrometheusInfo;
  monitoringData?: MonitoringData;
  activeType?: string;
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
  SelectBoxType,
  GlobalState, UserInfo, Menu,
  DashboardState, SummaryType, OrgMonitoringList, Prometheus, GroupInfo, AlertObj,
  BoardState, Notice, Board, BoardSearchParam, NoticeBoard, NoticePost, NoticeComment,
  EventState, EventLog, EventSearchParam, UnknownList, AlarmGroupUser, UnknownDataSource,
  Resource, AlertStatus, AlertStatusData,
  MonitoringState, MonitoringDetail, Monitoring, MetricData, SearchData,
};
