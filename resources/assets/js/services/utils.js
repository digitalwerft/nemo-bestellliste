import 'babel-polyfill'
import moment from 'moment'

moment.locale('de')

export default {
  formatDate(date) {
    return moment(date).format('Do MMMM YYYY')
  }
}
