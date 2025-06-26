import moment from 'moment';

export function formatDate(dateString: string, format: string = 'DD MMMM YYYY') {
  return moment(dateString).format(format);
}
