import createLogger from 'vuex/dist/logger';

const DEBUG = process.env.NODE_ENV !== 'production';

export default DEBUG ? [createLogger()] : [];
