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
//var VueFuse = require('vue-fuse');
window.Event = new Vue();
Vue.use(VueWaypoint);

Vue.prototype.$http = axios;

var iziToast = require('iziToast');
//var note = require('./plugins/notification.js');
//Vue.use(note);

iziToast.settings({
  close: false,
  pauseOnHover: true,
  timeout: 8000,
  progressBar: true,
  layout: 2,
  class: 'vue-toast'
})

Vue.prototype.$note = iziToast;

// register modal component
Vue.component('modal', require('./components/modal.vue'));
Vue.component('confirm', require('./components/confirm.vue'));

Vue.component('navbar', require('./components/navbar.vue'));
Vue.component('article-item', require('./components/article-item.vue'));
Vue.component('buyer', require('./components/buyer.vue'));
Vue.component('input-number', require('./components/input-number.vue'));
Vue.component('footer-nav', require('./components/footer-nav.vue'));

const app = new Vue({
    el: '#app',
    mounted() {
        this.$http.get('/api/order/123/buyers').then((response) => {
            this.data = response.data
            setTimeout(() => {
                this.isLoading = false;
                setTimeout(() => {
                    $('.loading-overlay').remove();
                }, 1000);
            }, 500);
        });
    },
    data: {
        isLoading: true,
        search: '',
        editingDetails: false,
        totalWinnings: 0,
        showModal: false,
        data: {
            user: {
                address: {}
            },
            buyers: []
        }
    },
    computed: {
        filteredBuyer() {
            return this.data.buyers.filter((buyer) => {
                return _.lowerCase(buyer.name).match(_.lowerCase(this.search));
            });
        },
        totalBuyers() {
            return this.data.buyers.length;
        },
        totalOrders() {
            var total = 0;
            return 35;
            _.each(this.data.buyers, function(buyer) {
                _.each(buyer.articles, function(article) {

                });
            })
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
        }
    },
    methods: {
        deleteBuyer(event) {
            this.data.buyers.splice(event, 1);
        },
        note(options) {
            var opt = {
                title: 'title',
                message: 'message',
                icon: 'fa fa-check',
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
