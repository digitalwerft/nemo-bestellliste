import "babel-polyfill";
import Vue from "vue";
import Vuex from "vuex";

import articles from './modules/articles'
import buyers from './modules/buyers'
import user from './modules/user'

Vue.use(Vuex);

const debug = process.env.NODE_ENV !== 'production'

export default new Vuex.Store({
  modules: {
    articles,
    buyers,
    user
  },
  mutations: {},
  getters: {},
  actions: {},
  strict: debug
});
