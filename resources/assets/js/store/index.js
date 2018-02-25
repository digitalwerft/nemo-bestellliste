import "babel-polyfill";

import Vue from "vue";
import Vuex from "vuex";

import fundraiser from './modules/fundraiser'
import campaigns from './modules/campaigns'
import items from './modules/items'
import collectors from './modules/collectors'
import campaign from './modules/campaign'
import orders from './modules/orders'

import Api from '../services/api'
import Auth from '../services/auth'

Vue.use(Vuex);

const debug = true

export default new Vuex.Store({
  state: {
    isAuthenticated: false,
    isLoading: false,
    editing: false,
    error: false,
    action: 'IDLE',
    actionCompleted: 'NONE',
    reload: false
  },
  modules: {
    fundraiser,
    campaigns,
    items,
    collectors,
    campaign,
    orders
  },
  mutations: {
    LOGIN(state) {
      state.isAuthenticated = true
      state.actionCompleted = 'LOGGED_IN'
      state.action = 'IDLE'
    },
    LOGOUT(state) {
      state.isAuthenticated = false
      state.actionCompleted = 'LOGGED_OUT'
      state.action = 'IDLE'
    },
    LOGGING_IN(state) {
      state.actionCompleted = state.action
      state.action = 'LOGGING_IN'
    },
    LOGGING_OUT(state) {
      state.actionCompleted = state.action
      state.action = 'LOGGING_OUT'
    },
    NO_RELOAD(state) {
      state.reload = false
    },
    FORCE_RELOAD(state) {
      state.reload = true
    },
    START_LOADING(state, action = 'SAVING') {
      state.actionCompleted = state.action
      state.isLoading = true
      state.error = false
      state.action = action
    },
    STOP_LOADING(state, action = 'NONE') {
      state.isLoading = false
      state.editing = false
      state.error = false
      state.actionCompleted = action
      state.action = 'IDLE'
    },
    START_EDITING(state, action = 'EDITING') {
      state.actionCompleted = state.action
      state.editing = true
      state.action = action
    },
    ERROR_SAVING(state, action = 'NONE') {
      state.isLoading = false
      state.editing = true
      state.error = true
      state.actionCompleted = action
      state.action = 'ERROR'
    },
    REQUEST_ERROR(state, action = 'NONE') {
      state.isLoading = false
      state.editing = true
      state.error = true
      state.actionCompleted = action
      state.action = 'ERROR'
    },
    STOP_EDITING(state) {
      state.actionCompleted = state.action
      state.editing = false
      state.action = 'IDLE'
    },
    SAVING_COLLECTOR(state) {
      state.actionCompleted = state.action
      state.action = 'SAVING COLLECTOR'
    },
    DELETING_COLLECTOR(state) {
      state.actionCompleted = state.action
      state.action = 'DELETING COLLECTOR'
    },
    CREATING_COLLECTOR(state) {
      state.actionCompleted = state.action
      state.action = 'CREATING COLLECTOR'
    },
    SAVING_ITEM(state) {
      state.actionCompleted = state.action
      state.action = 'SAVING ITEM'
    },
    DELETING_ITEM(state) {
      state.actionCompleted = state.action
      state.action = 'DELETING ITEM'
    },
    CREATING_ITEM(state) {
      state.actionCompleted = state.action
      state.action = 'CREATING ITEM'
    },
    SEARCHING(state) {
      state.actionCompleted = state.action
      state.action = 'SEARCHING'
    },
    RESET_ACTIONS(state) {
      state.actionCompleted = state.action
      state.action = 'IDLE'
    },
    PRINTING(state) {
      state.actionCompleted = state.action
      state.action = 'PRINTING'
    }
  },
  getters: {
    isQuoteEmpty(state) {
      return _.isEmpty(state.collectors.all)
    },
    isOrderPlaced(state) {
      return state.actionCompleted === 'ORDER_PLACED'
    },
    wasLoggedOut(state) {
      return state.actionCompleted === 'LOGGED_OUT'
    },
    forceReload(state) {
      return state.reload
    },
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
    getAllOpenRequests(state) {
      let modules = []
      _.forEach(state, (value, key) => {
        if (_.isObject(value) && !value.requestComplete) {
          modules.push(key)
        }
      })
      return modules
    },
    getAllCompletedRequests(state) {
      let modules = []
      _.forEach(state, (value, key) => {
        if (_.isObject(value) && value.requestComplete) {
          modules.push(key)
        }
      })
      return modules
    }
  },
  actions: {
    fetchModules({
      state,
      commit,
      dispatch,
      getters
    }, {
      modules,
      self,
      reload = false
    }) {
      return new Promise((resolve, reject) => {
        if (!Array.isArray(modules)) {
          modules = [modules]
        }
        if (!reload) {
          let completed = getters.getAllCompletedRequests
          modules = _.pullAll(modules, completed)
        }

        _.forEach(modules, module => {
          console.log(_.camelCase('fetch ' + module))

          dispatch(_.camelCase('fetch ' + module), {
            self: self
          }).then(() => {
            _.pull(modules, module)
            if (_.isEmpty(modules)) {
              resolve()
            }
          })
        })
      })
    },
    login({
      dispatch,
      commit
    }, {
      code,
      self
    }) {
      commit('LOGGING_IN')
      return new Promise((resolve, reject) => {
        Api.login(code).then(response => {
          Auth.login()
          commit('LOGIN')
          resolve()
        }).catch(error => {
          reject(error)
        })
      })

    },
    logout({
      dispatch,
      commit
    }) {
      commit('LOGGING_OUT')
      return new Promise((resolve, reject) => {
        Api.logout().then(() => {
          Auth.logout()
          commit('LOGOUT')
          resolve()
        }).catch(error => {
          commit('LOGOUT')
          resolve()
        })
      })
    }
  },
  strict: debug
});
