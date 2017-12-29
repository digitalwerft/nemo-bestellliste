/**
 * First we will load all of this project's JavaScript dependencies which
 * includes Vue and other libraries. It is a great starting point when
 * building robust, powerful web applications using Vue and Laravel.
 */

require('./bootstrap');

window.Vue = require('vue');

/**
 * Next, we will create a fresh Vue application instance and attach it to
 * the page. Then, you may begin adding components to this application
 * or customize the JavaScript scaffolding to fit your unique needs.
 */

var VueWaypoint = require('vue-waypoint');
var axios = require('axios');
var Vuex = require('vuex');
//var VueFuse = require('vue-fuse');
window.Event = new Vue();
Vue.use(Vuex);
Vue.use(VueWaypoint);

Vue.prototype.$http = axios;

var iziToast = require('iziToast');

iziToast.settings({
  close: false,
  pauseOnHover: true,
  timeout: 8000,
  progressBar: true,
  layout: 2,
  class: 'vue-toast'
});

Vue.prototype.$note = iziToast;

// register modal component
Vue.component('modal', require('./components/modal.vue'));
Vue.component('confirm', require('./components/confirm.vue'));

Vue.component('navbar', require('./components/navbar.vue'));
Vue.component('article-item', require('./components/article-item.vue'));
Vue.component('buyer', require('./components/buyer.vue'));
Vue.component('input-number', require('./components/input-number.vue'));
Vue.component('footer-nav', require('./components/footer-nav.vue'));

var vSelect = require('vue-select');
Vue.component('v-select', vSelect.VueSelect);

const store = new Vuex.Store({
  state: {
    buyers: [],
    articles: [],
    user: {}
  },
  mutations: {
    FETCH_BUYERS(state, buyers) {
      state.buyers = buyers
    },
    FETCH_ARTICLES(state, articles) {
      state.articles = articles
    },
    FETCH_USER(state, user) {
      state.user = user
    }
  },
  actions: {
    fetchBuyers({ commit }, { self }) {
      axios.get('/api/order/123/buyers').then((response) => {
          commit("FETCH_BUYERS", response.data);
      }).catch((error) => {
        console.log(error);
      });
    },
    fetchArticles({ commit }, { self }) {
      axios.get('/api/articles/list').then((response) => {
          commit("FETCH_ARTICLES", response.data);
      }).catch((error) => {
        console.log(error);
      });
    },
    fetchUser({ commit }, { self }) {
      axios.get('/api/user/123').then((response) => {
          commit("FETCH_USER", response.data);
      }).catch((error) => {
        console.log(error);
      });
    }
  }
});

const app = new Vue({
    el: '#app',
    mounted() {
      this.$store.dispatch('fetchBuyers', { self: this }).then(() => {
        this.loadingNumber++;
      });
      this.$store.dispatch('fetchArticles', { self: this }).then(() => {
        this.loadingNumber++;
      });
      this.$store.dispatch('fetchUser', { self: this }).then(() => {
        this.loadingNumber++;
      });
    },
    store,
    data() {
        return {
          isLoading: true,
          loadingNumber: 0,
          search: '',
          editingDetails: false,
          totalWinnings: 0,
          showModal: false
        };
    },
    computed: {
        user() {
          return this.$store.state.user;
        },
        buyers() {
          return this.$store.state.buyers;
        },
        articles() {
          return this.$store.state.articles;
        },
        filteredBuyer() {
            return this.buyers.filter((buyer) => {
                return _.lowerCase(buyer.name).match(_.lowerCase(this.search));
            });
        },
        totalBuyers() {
            return this.buyers.length;
        },
        totalOrders() {
            var total = 0;
            return 35;
            // _.each(this.data.buyers, function(buyer) {
            //     _.each(buyer.articles, function(article) {
            //
            //     });
            // });
        },
        winnings() {
            return 350;
        }
    },
    watch: {
        search(term) {
            //$list = $('.orders')
        },
        data(obj) {
            console.log(obj);
        },
        loadingNumber(num) {
          if(num === 3) {
            this.finishLoading();
          }
        }
    },
    methods: {
        finishLoading() {
          setTimeout(() => {
              this.isLoading = false;
              setTimeout(() => {
                  $('.loading-overlay').remove();
              }, 1000);
          }, 500);
        },
        deleteBuyer(event) {
            this.data.buyers.splice(event, 1);
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
            e.preventDefault();
            this.data.buyers.push({
                articles: [],
                name: '',
                state: 'active'
            });
        }
    }

});
