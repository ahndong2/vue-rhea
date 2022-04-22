const COMMON = {
  id: 'id',
  name: 'name',
  desc: 'description',
  creator: 'creator',
  modifier: 'modifier',
  registDate: 'registDate',
  modifyDate: 'modifyDate',
  useYn: 'useYn',
  depth: 'depth',
  pId: 'pId',
};

const ORGANIZATION = {
  ...COMMON,
  organizationId: 'organizationId',
  organizationName: 'organizationName',
};

export { COMMON, ORGANIZATION };
