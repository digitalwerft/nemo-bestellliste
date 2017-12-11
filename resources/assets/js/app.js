
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
 Vue.use(VueWaypoint);

Vue.component('example-component', require('./components/ExampleComponent.vue'));
Vue.component('navbar', require('./components/navbar.vue'));
Vue.component('article-item', require('./components/article-item.vue'));
Vue.component('owner', require('./components/owner.vue'));
Vue.component('input-number', require('./components/input-number.vue'));

const app = new Vue({
    el: '#app',
    data: ()=> {
        return {
            orderNr: '1736567738872-WD',
            user: {
                name: {
                    firstName: 'Alfred',
                    lastName: 'Befred'
                },
                email: 'alfred@befred.com',
                adress: {
                    street: 'Meine Straße 29',
                    zip: '19283',
                    city: 'Freiburg'
                },
                message: 'ahjsgdjkhasgdhahsjgdakgjhjhasgd'
            },
            clients: [
                {
                    name: 'Vorname Name',
                    articles: [
                        {
                            id: '350',
                            name: 'Leon 35-38',
                            price: 15,
                            amount: 2
                        },
                        {
                            id: '212',
                            name: 'Fridolin 43-46',
                            price: 15,
                            amount: 1
                        }
                    ]
                },
                {
                    name: 'Max Mustermann',
                    articles: [
                        {
                            id: '350',
                            name: 'Leon 35-38',
                            price: 15,
                            amount: 4
                        },
                        {
                            id: '212',
                            name: 'Fridolin 43-46',
                            price: 15,
                            amount: 1
                        }
                    ]
                },
                {
                    name: 'Marianne Musterfrau',
                    articles: [
                        {
                            id: '395',
                            name: 'Svenja 39-42',
                            price: 15,
                            amount: 2
                        },
                        {
                            id: '582',
                            name: 'Lotta',
                            price: 20,
                            amount: 1
                        }
                    ]
                }
            ]
        }
    }
});
