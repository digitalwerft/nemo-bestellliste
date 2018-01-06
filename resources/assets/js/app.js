import 'babel-polyfill'
/**
 * First we will load all of this project's JavaScript dependencies which
 * includes Vue and other libraries. It is a great starting point when
 * building robust, powerful web applications using Vue and Laravel.
 */

import './bootstrap';

import Vue from 'vue';

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

Vue.use(VueWaypoint)
Vue.use(shortkey)
Vue.use(Popover)

Vue.prototype.$http = axios;

import iziToast from 'iziToast';

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

import buyer from './components/buyer.vue'
import footerNav from './components/footer-nav.vue'
import navbar from './components/navbar.vue'
import user from './components/user.vue'
import infoBox from './components/info-box.vue'

import store from './store'

function save(payload) {
  console.log("saving", payload);
}

var saveDebounced = _.wrap(_.memoize(function() {
  return _.debounce(save, 5000);
}, _.property("partId")), function(func, payload) {
  return func(payload)(payload);
});

const app = new Vue({
  el: '#app',
  components: {
    buyer,
    footerNav,
    navbar,
    user,
    infoBox
  },
  mounted() {
    this.$store.dispatch('fetchBuyers', {
      self: this
    }).then(() => {
      this.loadingProgress++;
    });
    this.$store.dispatch('fetchArticles', {
      self: this
    }).then(() => {
      this.loadingProgress++;
    });
    this.$store.dispatch('fetchUser', {
      self: this
    }).then(() => {
      this.loadingProgress++;
    });
    if(!this.buyers) {
      displayInfo = true;
    }
  },
  store,
  data() {
    return {
      isLoading: true,
      loadingProgress: 0,
      search: '',
      totalWinnings: 0,
      showModal: false,
      hasUnsavedBuyer: false,
      savingComplete: false,
      displayInfo: false
    };
  },
  computed: {
    buyers() {
      return this.$store.state.buyers.all;
    },
    articles() {
      return this.$store.state.articles.all;
    },
    filteredBuyer() {
      if (!_.isEmpty(this.buyers)) {
        var v = this.buyers.filter((buyer) => {
          return _.lowerCase(buyer.name).match(_.lowerCase(this.search));
        });
        return v;
      }
    },
    totalBuyers() {
      return this.buyers.length;
    },
    totalOrders() {
      return this.$store.getters.getTotalOrdersAmount;
    },
    winnings() {
      return this.$store.getters.getTotalOrdersWinnings
    },
    earnings() {
      return this.$store.getters.getTotalOrdersEarnings
    }
  },
  watch: {
    search(term) {
      //$list = $('.orders')
    },
    data(obj) {
      //console.log(obj);
    },
    loadingProgress(num) {
      if (num === 3) {
        this.finishLoading();
      }
    }
  },
  methods: {
    handleEditing(isEditing) {
      if (isEditing) {
        this.hasUnsavedBuyer = true
      } else {
        this.hasUnsavedBuyer = false
      }
    },
    onBuyerEdit(a) {
      //console.log(a)
    },
    onBuyerSaved() {
      if (this.hasUnsavedBuyer) {
        this.hasUnsavedBuyer = false
      }
    },
    onBuyerDeleted() {
      if (this.hasUnsavedBuyer) {
        this.hasUnsavedBuyer = false
      }
    },
    finishLoading() {
      setTimeout(() => {
        this.isLoading = false
        $('.loading-overlay').removeClass('loading');
        setTimeout(() => {
          $('.loading-overlay').remove();
        }, 1000);
      }, 600);
    },
    note(options) {
      var opt = {
        title: 'title',
        message: 'message',
        color: 'green',
        icon: 'mdi mdi-check'
      };
      iziToast.show(_.merge(opt, options));
    },
    createBuyer(e) {
      if (e) {
        e.preventDefault();
      }
      if (!this.hasUnsavedBuyer) {
        this.hasUnsavedBuyer = true
        this.$store.commit('newBuyer')
      }
    }
  }

});
