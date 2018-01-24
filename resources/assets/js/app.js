import 'babel-polyfill'
/**
 * First we will load all of this project's JavaScript dependencies which
 * includes Vue and other libraries. It is a great starting point when
 * building robust, powerful web applications using Vue and Laravel.
 */

import './bootstrap';

import Vue from 'vue';
import VueRouter from 'vue-router'

import routes from './routes'

/**
 * Next, we will create a fresh Vue application instance and attach it to
 * the page. Then, you may begin adding components to this application
 * or customize the JavaScript scaffolding to fit your unique needs.
 */

import VueWaypoint from 'vue-waypoint'
import axios from 'axios';
import shortkey from 'vue-shortkey'
import Popover from 'vue-js-popover'
import * as directives from './directives'

// Use Plugins
Vue.use(VueRouter)
Vue.use(VueWaypoint)
Vue.use(shortkey)
Vue.use(Popover)

Vue.prototype.$http = axios;

import iziToast from 'izitoast';

iziToast.settings({
  close: false,
  pauseOnHover: true,
  timeout: 5000,
  progressBar: true,
  layout: 2,
  class: 'vue-toast',
  icon: 'mdi mdi-information-outline'
});

Vue.prototype.$note = iziToast;

const router = new VueRouter({
  routes
})


const app = new Vue({
  router
})

router.beforeEach(routes.guard)
router.replace({name: 'login'})

app.$mount('#app')

window.router = router