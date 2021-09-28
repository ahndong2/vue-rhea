import moment from 'moment';

export const addMinutes = (addMinute: string, format = 'YYYY-MM-DD HH:mm'): string => moment().add(addMinute, 'minutes').format(format);

export const addHours = (addHour: string, format = 'YYYY-MM-DD HH:mm'): string => moment().add(addHour, 'hours').format(format);
