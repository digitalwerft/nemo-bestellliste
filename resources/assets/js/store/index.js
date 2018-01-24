import "babel-polyfill";

import Vue from "vue";
import Vuex from "vuex";

import fundraiser from './modules/fundraiser'
import campaigns from './modules/campaigns'

import articles from './modules/articles'
import buyers from './modules/buyers'
import user from './modules/user'

Vue.use(Vuex);

const debug = true

export default new Vuex.Store({
  state: {
    isAuthenticated: false
  },
  modules: {
    fundraiser,
    campaigns,
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
    hasLoaded(state) {
      return (modules) => {
        if (!Array.isArray(modules)) {
          modules = [modules]
        }

        return modules.reduce((value, module) => {
          return value && !!(state[module] && state[module].requestComplete)
        }, true)
      }
    },
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
