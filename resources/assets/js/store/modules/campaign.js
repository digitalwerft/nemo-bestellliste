const state = {
  data: {},
  requestComplete: false
}

const getters = {
  getCampaign(state, getters) {
    return state.data
  }
}

const actions = {
  fetchCampaign({
    commit
  }, {
    self
  }) {
    return new Promise((resolve, reject) => {
      self.$http.get('/api/campaign/'+self.$route.params.id)
        .then(response => {
          commit('FETCH_CAMPAIGN', response.data)
          resolve(response)
        }).catch(error => {
          reject(error)
        })
    })
  }
}

const mutations = {
  FETCH_CAMPAIGN(state, campaign) {
    state.data = campaign;
    state.requestComplete = true;
  },
  UPDATE_SHIPPING_ADDRESS(state, address) {
    state.data.shipping_address = address
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
