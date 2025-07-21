import moment from 'moment';

export function formatDate(dateString: string | Date, format: string = 'DD MMMM YYYY') {
  return moment(dateString).format(format) == 'Invalid date'
    ? '-'
    : moment(dateString).format(format);
}
