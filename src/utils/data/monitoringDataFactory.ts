const MONITORING = {
  chartList: {
    cpuList: 'cpuList',
    memoryList: 'memoryList',
    storageList: 'storageList',
    networkReceptionList: 'networkReceptionList',
    networkSendList: 'networkSendList',
    systemLoadList: 'systemLoadList',
    podErrorList: 'podErrorList',
  },
  dotList: {
    nodeList: 'nodeList',
    podList: 'podList',
  },
  nodeListSummary: 'nodeListSummary',
  podListSummary: 'podListSummary',
};

export const setMonitoringListDataFactory = (data) => {
  const rtn = {};
  const keys: string[] = Object.keys(data);

  for (let i = 0; i < keys.length; i++) {
    const key = keys[i];
    let monitoring = data[key];
    if (Object.keys(MONITORING.chartList).includes(key)) {
      monitoring = monitoring.data.result.map((v) => {
        const val = v.value || v.values;
        return val.map((v2) => ({
          x: v2[0],
          y: v2[1],
          metric: v.metric,
          key,
        }));
      });
    }
    rtn[key] = monitoring;
  }
  return rtn;
};
