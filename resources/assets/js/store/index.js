import "babel-polyfill";
import Vue from "vue";
import Vuex from "vuex";

import articles from './modules/articles'
import buyers from './modules/buyers'
import user from './modules/user'

Vue.use(Vuex);

const debug = true

export default new Vuex.Store({
  modules: {
    articles,
    buyers,
    user
  },
  mutations: {},
  getters: {
    hasFullyLoaded(state, getters) {
      var buyers = !_.isEmpty(state.buyers.all)
      var articles = !_.isEmpty(state.articles.all)
      var user = !_.isEmpty(state.user.data)

      return state.buyers.requestComplete == state.user.requestComplete == state.articles.requestComplete
    }
  },
  actions: {
    fetchAll({
      dispatch, commit
    }, {
      self
    }) {
      dispatch('fetchBuyers', {self: self})
      dispatch('fetchArticles', {self: self})
      dispatch('fetchUser', {self: self})
    }
  },
  strict: debug
});
