const state = {
  data: {},
  requestComplete: false
}

const getters = {
  getCampaigns(state, getters) {
    return state.data
  }
}

const actions = {
  fetchCampaigns({
    commit
  }, {
    self
  }) {
    return new Promise((resolve, reject) => {
      self.$http.get('/api/campaigns')
        .then(response => {
          commit('FETCH_CAMPAIGNS', response.data)
          resolve(response)
        }).catch(error => {
          reject(error)
        })
    })
  }
}

const mutations = {
  FETCH_CAMPAIGNS(state, campaigns) {
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
