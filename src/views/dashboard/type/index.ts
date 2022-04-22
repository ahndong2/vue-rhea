interface SummaryType {
  label?: string,
  count?: number,
  [key:string]: unknown,
}
interface SummaryTypeArray {
  summaryData?: SummaryType[];
}

interface Groupinfo {
  name?:string;
  grafanaLink?: string,
  rheaLink?: string,
}
interface Prometheus {
  name?: string,
  info?: string,
  grafanaLink?: string,
  rheaLink?: string,
  groupinfo?: Groupinfo[],
  active?: boolean,
}
interface MonitoringListType {
  id?: number,
  name?: string,
  grafanaLink?: string,
  rheaLink?: string,
  prometheuses: Prometheus[],
  active?: boolean,
}
export { SummaryType, SummaryTypeArray, MonitoringListType };
