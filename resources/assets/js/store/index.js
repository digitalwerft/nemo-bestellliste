import "babel-polyfill";
import Vue from "vue";
import Vuex from "vuex";

import articles from './modules/articles'
import buyers from './modules/buyers'
import user from './modules/user'

Vue.use(Vuex);

const debug = process.env.NODE_ENV !== 'production'

export default new Vuex.Store({
  state: {
    isAuthenticated: false
  },
  modules: {
    articles,
    buyers,
    user
  },
  mutations: {
    LOGIN(state) {
      state.isAuthenticated = true
    }
  },
  getters: {
    hasFullyLoaded(state, getters) {
      var buyers = !_.isEmpty(state.buyers.all)
      var articles = !_.isEmpty(state.articles.all)
      var user = !_.isEmpty(state.user.data)

      return state.buyers.requestComplete == state.user.requestComplete == state.articles.requestComplete
    }
  },
  actions: {
    fetchAll({dispatch, commit}, {self}) {
      dispatch('fetchBuyers', {self: self})
      dispatch('fetchArticles', {self: self})
      dispatch('fetchUser', {self: self})
    },
    login({dispatch, commit}) {
      commit(LOGIN)
    }
  },
  strict: debug
});
