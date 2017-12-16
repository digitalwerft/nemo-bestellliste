//var Vue = require('vue');
var iziToast = require('iziToast');

export default function install () {
  Object.defineProperties(Vue.prototype, {
    $note: {
      get () {
        return iziToast
      }
    }
  })
}
