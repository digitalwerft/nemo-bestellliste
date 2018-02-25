import 'babel-polyfill'
import moment from 'moment'
import iziToast from 'izitoast'

moment.locale('de')

export default {
  formatDate(date) {
    return moment(date).format('Do MMMM YYYY')
  },
  note: iziToast
}
