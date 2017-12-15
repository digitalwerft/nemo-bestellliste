
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

Vue.component('navbar', require('./components/navbar.vue'));
Vue.component('article-item', require('./components/article-item.vue'));
Vue.component('buyer', require('./components/buyer.vue'));
Vue.component('input-number', require('./components/input-number.vue'));

// highlight filter
Vue.filter('highlight', function(words, query){
    var iQuery = new RegExp(query, "ig");
    console.log(words);
    return words.toString().replace(iQuery, function(matchedTxt,a,b){
        return ('<span class=\'highlight\'>' + matchedTxt + '</span>');
    });
});

const app = new Vue({
    el: '#app',
    mounted() {
        this.$http.get('/api/order/123/buyers').then((response) => {
            this.data = response.data
            setTimeout(()=> {
                this.isLoading = false;
                setTimeout(()=> {
                    $('.loading-overlay').remove();
                }, 1000);
            }, 500);
        });
    },
    data:  {
        isLoading: true,
        search: '',
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
        }
    },
    watch: {
        search(term) {
            //$list = $('.orders')
        }
    },
    methods: {
        deleteBuyer(event) {
            this.data.buyers.splice(event, 1);
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
