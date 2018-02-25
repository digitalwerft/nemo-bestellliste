import Api from '../../services/api'

const state = {
  data: {},
  requestComplete: false
}

const getters = {
  getOrders(state, getters) {
    return state.data
  },
  hasOrders(state) {
    return !_.isEmpty(state.data)
  }
}

const actions = {
  fetchOrders({
    commit
  }, {
    self
  }) {
    commit('START_LOADING', 'FETCHING_ORDERS')

    return new Promise((resolve, reject) => {

      Api.fetchOrders(self.$route.params.id)
        .then(response => {
          commit('FETCH_ORDERS', response.data)
          commit('STOP_LOADING', 'FETCHED_ORDERS')
          resolve(response)
        }).catch(error => {
          commit('REQUEST_ERROR', 'FETCHED_ORDERS')
          reject(error)
        })
    })
  }
}

const mutations = {
  FETCH_ORDERS(state, campaigns) {
    state.data = campaigns;
    state.requestComplete = true;
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
