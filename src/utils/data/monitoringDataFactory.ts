import { MONITORING_INFO } from '@/constants';

// monitoring/monitoringDetailDivide api 호출시
export const setMonitoringListDataFactory = (data, activeType) => {
  const rtn = {};
  const keys: string[] = Object.keys(data);

  for (let i = 0; i < keys.length; i++) {
    const key = keys[i];
    let monitoring = data[key];
    if (Object.keys(MONITORING_INFO[activeType]).includes(key) && !MONITORING_INFO[activeType][key].notDataFactory) {
      monitoring = !monitoring ? [] : monitoring.data.result.map((v) => {
        const val = v.value || v.values;
        const rtnObj = {
          name: MONITORING_INFO[activeType][key].name,
          metric: v.metric,
          noChart: MONITORING_INFO[activeType][key].noChart || '',
          key,
        };
        return v.value ? { ...rtnObj, x: v.value[0], y: v.value[1] } : val.map((v2) => ({
          ...rtnObj,
          x: v2[0],
          y: v2[1],
        }));
      });
    }

    // podList 성공 맨앞으로 sort
    if (key === 'podList' && monitoring && monitoring.podAbledList.length > 0) {
      monitoring.podAbledList = [...monitoring.podAbledList].sort((a, b) => (a.phase[0] === 'Succeeded' ? 0 : 1) - (b.phase[0] === 'Succeeded' ? 0 : 1));
    }
    rtn[key] = monitoring;
  }
  return rtn;
};
