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
    action: 'IDLE'
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
      state.action = 'LOGGED_IN'
    },
    LOGOUT(state) {
      state.isAuthenticated = false
      state.action = 'LOGGED_OUT'
    },
    LOGGING_IN(state) {
      state.action = 'LOGGING_IN'
    },
    LOGGING_OUT(state) {
      state.action = 'LOGGING_OUT'
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
    },
    PRINTING(state) {
      state.action = 'PRINTING'
    }
  },
  getters: {
    wasLoggedOut(state) {
      return (state.action === 'LOGGING_OUT' || state.action === 'LOGGED_OUT')
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
      self
    }) {
      return new Promise((resolve, reject) => {
        if (!Array.isArray(modules)) {
          modules = [modules]
        }
        let completed = getters.getAllCompletedRequests
        modules = _.pullAll(modules, completed)

        if (!getters.hasLoaded(modules)) {
          _.forEach(modules, module => {
            if (!getters.hasLoaded(module)) {
              dispatch(_.camelCase('fetch ' + module), {
                self: self
              }).then(() => {
                _.pull(modules, module)
                if (_.isEmpty(modules)) {
                  resolve()
                }
              })
            } else {
              _.pull(modules, module)
              if (_.isEmpty(modules)) {
                resolve()
              }
            }
          })
        }
      })
    },
    login({
      dispatch,
      commit
    }, {
      code,
      self
    }) {
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
