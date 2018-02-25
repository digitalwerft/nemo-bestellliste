import Api from '../../services/api'

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
      commit('START_LOADING', 'FETCHING_CAMPAIGNS')
      Api.fetchCampaigns()
        .then(response => {
          commit('FETCH_CAMPAIGNS', response.data)
          commit('STOP_LOADING', 'FETCHED_CAMPAIGNS')
          resolve(response)
        }).catch(error => {
          commit('REQUEST_ERROR', 'FETCHED_CAMPAIGNS')
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
