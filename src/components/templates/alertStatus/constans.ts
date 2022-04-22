import { MONITORING_INFO } from '@/constants';

const ALERT_STATUS_TAB_DATA = [
  { key: 'RESOURCE', name: 'RESOURCE', value: 'resourceUnconfirmedCnt' },
  { key: 'PROCESS', name: 'PROCESS', value: 'processUnconfirmedCnt' },
  { key: 'K8S', name: 'K8S', value: 'k8sUnconfirmedCnt' },
  { key: 'SERVICE', name: 'SERVICE', value: 'serviceUnconfirmedCnt' },
  { key: 'DB', name: 'DB', value: 'dbUnconfirmedCnt' },
  { key: 'NATIVE', name: 'NATIVE', value: 'nativeUnconfirmedCnt' },
  { key: 'RHEA', name: 'RHEA', value: 'rheaUnconfirmedCnt' },
  { key: 'WEBHOOK', name: 'WEBHOOK', value: 'webHookUnconfirmedCnt' },
  { key: 'CUSTOM_PROMQL', name: 'PROMQL', value: 'customPromqlUnconfirmedCnt' },
];

export { ALERT_STATUS_TAB_DATA, MONITORING_INFO };
