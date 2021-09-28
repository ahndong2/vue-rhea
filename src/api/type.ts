import {
  Board, SummaryType, OrgMonitoringList, EventLog, MetricData,
} from '@/store/type';

interface RespBoardState {
  id?: number;
  board?: Board;
  titme?: string
  regDate?: number;
  updateDate?: number;
  [key:string]: unknown,
}
interface RespDashboardAlertState {
  minute?: SummaryType[],
  time?:SummaryType[],
  dayUnresolvedCnt?: number,
  totalUnresolvedCnt?: number,
}

type RespMonitoringListState = OrgMonitoringList;
type RespEventLogState = EventLog[];

interface MetricObject {
  metric?: MetricData[];
  value?: [];
  values?: [];
}
interface MonitoringData {
  resultType?: string;
  result?: MetricObject[];
}
interface RespMonitoringDetailState {
  status?: string;
  data?: MonitoringData;
}
export {
  RespBoardState,
  RespDashboardAlertState,
  RespMonitoringListState,
  RespEventLogState,
  RespMonitoringDetailState,
};
