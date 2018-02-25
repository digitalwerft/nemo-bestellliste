import Api from '../../services/api'

const state = {
  data: {},
  requestComplete: false
}

const getters = {
  getOrders(state, getters) {
    return state.data
  }
}

const actions = {
  fetchOrders({
    commit
  }, {
    self
  }) {
    return new Promise((resolve, reject) => {
      Api.fetchOrders(self.$route.params.id)
        .then(response => {
          commit('FETCH_ORDERS', response.data)
          resolve(response)
        }).catch(error => {
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
