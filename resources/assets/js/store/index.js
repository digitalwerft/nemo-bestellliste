import "babel-polyfill";

import Vue from "vue";
import Vuex from "vuex";

import fundraiser from './modules/fundraiser'
import campaigns from './modules/campaigns'
import items from './modules/items'
import collectors from './modules/collectors'
import campaign from './modules/campaign'

import api from '../services/api'

Vue.use(Vuex);

const debug = true

export default new Vuex.Store({
  state: {
    isAuthenticated: false,
    isLoading: false,
    editing: false,
    error: false,
    action: 'IDLE'
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
    },
    LOGOUT(state) {
      state.isAuthenticated = false
    },
    START_LOADING(state, action = 'SAVING') {
      state.isLoading = true
      state.error = false
      state.action = action
    },
    STOP_LOADING(state) {
      state.isLoading = false
      state.editing = false
      state.error = false
      state.action = 'IDLE'
    },
    START_EDITING(state, action = 'EDITING') {
      state.editing = true
      state.action = action
    },
    ERROR_SAVING(state) {
      state.isLoading = false
      state.editing = true
      state.error = true
    },
    STOP_EDITING(state) {
      state.editing = false
      state.action = 'IDLE'
    },
    SAVING_COLLECTOR(state) {
      state.action = 'SAVING COLLECTOR'
    },
    DELETING_COLLECTOR(state) {
      state.action = 'DELETING COLLECTOR'
    },
    CREATING_COLLECTOR(state) {
      state.action = 'CREATING COLLECTOR'
    },
    SAVING_ITEM(state) {
      state.action = 'SAVING ITEM'
    },
    DELETING_ITEM(state) {
      state.action = 'DELETING ITEM'
    },
    CREATING_ITEM(state) {
      state.action = 'CREATING ITEM'
    },
    SEARCHING(state) {
      state.action = 'SEARCHING'
    },
    RESET_ACTIONS(state) {
      state.action = 'IDLE'
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
      commit('LOGIN')
    },
    logout({dispatch, commit}) {
      api.logout().then(() => {
        commit('LOGOUT')
      })
    }
  },
  strict: debug
});
