import Api from '../../services/api'

const state = {
  data: {},
  requestComplete: false
}

const getters = {
  getFundraiser(state, getters) {
    return state.data
  }
}

const actions = {
  fetchFundraiser({
    commit
  }, {
    self
  }) {
    commit('START_LOADING', 'FETCHING_FUNDRAISER')
    return new Promise((resolve, reject) => {
      Api.fetchFundraiser('/Api/fundraiser')
        .then(response => {
          commit('FETCH_FUNDRAISER', response.data)
          commit('STOP_LOADING', 'FETCHED_FUNDRAISER')
          resolve(response)
        }).catch(error => {
          commit('REQUEST_ERROR', 'FETCHED_FUNDRAISER')
          dispatch('logout')
          reject(error)
        })
    })
  }
}

const mutations = {
  FETCH_FUNDRAISER(state, fundraiser) {
    state.data = fundraiser;
    state.requestComplete = true;
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
