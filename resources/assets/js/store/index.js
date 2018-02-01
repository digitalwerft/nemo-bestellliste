import "babel-polyfill";

import Vue from "vue";
import Vuex from "vuex";

import fundraiser from './modules/fundraiser'
import campaigns from './modules/campaigns'
import items from './modules/items'
import collectors from './modules/collectors'
import campaign from './modules/campaign'

Vue.use(Vuex);

const debug = true

export default new Vuex.Store({
  state: {
    isAuthenticated: false
  },
  modules: {
    fundraiser,
    campaigns,
    items,
    collectors,
    campaign
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
      var collectors = !_.isEmpty(state.collectors.all)
      var items = !_.isEmpty(state.items.all)
      var campaign = !_.isEmpty(state.campaign.data)

      return state.collectors.requestComplete == state.campaign.requestComplete == state.items.requestComplete
    }
  },
  actions: {
    fetchAll({dispatch, commit}, {self}) {
      dispatch('fetchCollectors', {self: self})
      dispatch('fetchItems', {self: self})
      dispatch('fetchCampaign', {self: self})
      dispatch('fetchFundraiser', {self: self})
      dispatch('fetchCampaigns', {self: self})
    },
    login({dispatch, commit}) {
      commit(LOGIN)
    }
  },
  strict: debug
});
