const MONITORING_INFO = {
  // type Object
  // name: 화면에 보여질 text
  // searchType : api 보낼 type
  // period : 차트에 표시될 단위
  // noChart : 차트 형태가 아닌
  // notDataFactory : 차트 형태가 아닌 가공될 데이터가 아님
  RESOURCE: {
    cpuList: { name: 'CPU', searchType: 'CPU', period: '%' },
    memoryList: { name: 'Memory', searchType: 'Memory', period: '%' },
    storageList: { name: 'Storage', searchType: 'Storage', period: '%' },
    networkReceptionList: { name: 'Network', searchType: 'NetworkReception', period: 'Mbps' },
    healthCheckList: { name: 'HealthCheck', searchType: 'HealthCheck', noChart: 'table' },
    systemLoadList: { name: 'SystemLoad', searchType: 'SystemLoad' },
  },
  PROCESS: {
    processNumList: { name: 'ProcessNum', searchType: 'ProcessNum' },
    processCPUList: { name: 'ProcessCPU', searchType: 'ProcessCPU' },
    sleepingStateList: { name: 'SleepingState', searchType: 'SleepingState' },
    waitingStateList: { name: 'WaitingState', searchType: 'WaitingState' },
    otherStateList: { name: 'OtherState', searchType: 'OtherState' },
    zombieStateList: { name: 'ZombieState', searchType: 'ZombieState' },
  },
  K8S: {
    nodeList: { name: 'Node', searchType: 'Node', notDataFactory: true },
    podList: { name: 'Pod', searchType: 'Pod', notDataFactory: true },
    podErrorList: { name: 'PodError', searchType: 'PodError' },
    podPvStatusList: { name: 'PVStatus', searchType: 'PVStatus', notDataFactory: true },
    podPvcStatusList: {
      name: 'PVCStatus', searchType: 'PVCStatus', notDataFactory: true,
    },
    podCpuList: { name: 'PodCPU', searchType: 'PodCPU' },
    podMemoryList: { name: 'PodMemory', searchType: 'PodMemory' },
    deploymentList: {
      name: 'Deployment', searchType: 'Deployment', period: '%',
    },
    daemonSetList: {
      name: 'DaemonSet', searchType: 'DaemonSet', period: '%',
    },
    replicasetList: {
      name: 'ReplicaSet', searchType: 'Replicaset', period: '%',
    },
    replicationControllerList: { name: 'Replication Controller', searchType: 'Controller' },
    jobList: { name: 'Job', searchType: 'Job' },
    statefulSetList: {
      name: 'StatefulSet', searchType: 'StatefulSet', period: '%',
    },
  },
  SERVICE: {
    blackBoxList: { name: 'BlackBox', searchType: 'BlackBox' },
    httpDurationList: { name: 'HTTP Duration', searchType: 'HttpDuration' },
    sslCertExpiryList: { name: 'SSL Cert Expiry', searchType: 'SslCertExpiry' },
    urlStatusList: { name: 'URL Status', searchType: 'UrlStatus' },
    blackboxProbeDurationList: { name: 'Blackbox Probe Duration', searchType: 'BlackboxProbeDuration' },
  },
  DB: {
    qpsList: { name: 'QPS', searchType: 'QPS' },
    threadConnectionsList: { name: 'Thread Connections', searchType: 'ThreadConnections' },
    selectScanList: { name: 'Select Scan', searchType: 'SelectScan' },
    slowQueriesList: { name: 'Slow Queries', searchType: 'SlowQueries', period: '개수' },
    tableLocksImmediateList: { name: 'Table Locks Immediate', searchType: 'TableLocksImmediate' },
    tableLocksWaitedList: { name: 'Table Locks Waited', searchType: 'TableLocksWaited' },
    slaveBehindSecondsList: { name: 'Slave Behind Seconds', searchType: 'SlaveBehindSeconds' },
  },
  NATIVE: {
    cpuUtilizationList: { name: 'CPU Utilization', searchType: 'CPUUtilization' },
    freeableMemoryList: { name: 'Freeable Memory', searchType: 'FreeableMemory' },
    freeStorageSpaceList: { name: 'Free Storage Space', searchType: 'FreeStorageSpace' },
    databaseConnectionsList: { name: 'Database Connections', searchType: 'DatabaseConnections' },
    cwagentMemUsedPercentList: { name: 'Cwagent Mem Used Percent', searchType: 'CwagentMemUsedPercent' },
    cwagentDiskUsedPercentList: { name: 'Cwagent Disk Used Percent', searchType: 'CwagentDiskUsedPercent' },
    ec2StatusCheckFailedList: { name: 'Ec2 Status Check Failed', searchType: 'Ec2StatusCheckFailed' },
    swapUsageList: { name: 'SwapUsage', searchType: 'SwapUsage' },
    replicaLagList: { name: 'ReplicaLag', searchType: 'ReplicaLag' },
    readLatencyList: { name: 'ReadLatency', searchType: 'ReadLatency' },
    writeLatencyList: { name: 'WriteLatency', searchType: 'WriteLatency' },
    readIOPSList: { name: 'ReadIOPS', searchType: 'ReadIOPS' },
    writeIOPSList: { name: 'WriteIOPS', searchType: 'WriteIOPS' },
    diskQueueDepthList: { name: 'DiskQueueDepth', searchType: 'DiskQueueDepth' },
    readThroughputList: { name: 'ReadThroughput', searchType: 'ReadThroughput' },
    writeThroughputList: { name: 'WriteThroughput', searchType: 'WriteThroughput' },
    networkReceiveThroughputList: { name: 'Network Receive Throughput', searchType: 'NetworkReceiveThroughput' },
    elbUnHealthyHostCountList: { name: 'Elb UnHealthy Host Count', searchType: 'ElbUnHealthyHostCount' },
    elbHealthyHostCountList: { name: 'Elb Healthy Host Count', searchType: 'ElbHealthyHostCount' },
    ec2CPUUtilizationList: { name: 'Ec2 CPU Utilization', searchType: 'Ec2CPUUtilization' },
  },
  RHEA: {
    allCollectorDownList: { name: 'All Collector Down', searchType: 'AllCollectorDown' },
    collectErrorList: { name: 'Collect Error', searchType: 'CollectError' },
    prometheusConnectionErrorList: { name: 'Prometheus Connection Error', searchType: 'PrometheusConnectionError' },
  },
  WEBHOOK: {
    webHookList: { name: 'Webhook', searchType: 'WebHook' },
  },
  CUSTOM_PROMQL: {
  },
};

export { MONITORING_INFO };
