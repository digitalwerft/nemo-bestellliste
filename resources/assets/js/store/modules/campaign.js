import Api from '../../services/api'
import iziToast from 'izitoast'

function stopLoading(commit, lastAction = 'NONE', withError = false, timeout = 500) {
  setTimeout(() => {
    commit('STOP_LOADING', lastAction)
    if (withError) {
      commit('ERROR_SAVING', lastAction)
    }
  }, timeout)
}

const state = {
  data: {},
  quote: {},
  orders: [],
  requestComplete: false
}

const getters = {
  getCampaign(state, getters) {
    return state.data
  },
  getQuote(state) {
    return state.quote
  },
  getCampaignId(state) {
    return state.data.id
  },
  getComment(state) {
    return state.quote.comment
  },
  isCurrentCampaign: state => id => {
    return state.data.id == id
  }
}

const actions = {
  fetchCampaign({
    commit
  }, {
    self
  }) {
    commit('START_LOADING', 'FETCHING_QUOTE')
    return Api.fetchQuote(self.$route.params.id).then(quoteResponse => {
      commit('FETCH_QUOTE', quoteResponse.data)
      stopLoading(commit, 'FETCHED_QUOTE')
      commit('START_LOADING', 'FETCHING_CAMPAIGN')
      Api.fetchCampaign(self.$route.params.id)
        .then(response => {
          commit('FETCH_CAMPAIGN', response.data)
          stopLoading(commit, 'FETCHED_CAMPAIGN')
          //resolve(response)
        }).catch(error => {
          commit('REQUEST_ERROR', 'FETCHED_CAMPAIGN')
        })
      })
  },
  placeOrder({
    commit
  }, {
    self
  }) {
    commit('START_LOADING', 'PLACING_ORDER')
    return new Promise((resolve, reject) => {
      Api.placeOrder(self.$route.params.id).then(response => {
        commit('STOP_LOADING', 'ORDER_PLACED')
        resolve()
      }).catch(error => {
      commit('REQUEST_ERROR', 'ORDER_PLACED')
        reject()
      })
    })
  },
  saveComment({
    commit
  }, {
    quote, newComment
  }) {
    commit('START_LOADING', 'SAVING_COMMENT')
    return new Promise((resolve, reject) => {
      Api.saveComment(quote, newComment).then(response => {
        commit('SAVE_COMMENT', newComment)
        stopLoading(commit, 'SAVED_COMMENT')
        iziToast.success({
          message: 'Kommentar erfolgreich gespeichert.'
        })
        resolve(response)
      }).catch(error => {
        stopLoading(commit, 'FETCHED_CAMPAIGN', true)
        iziToast.error({
          message: error.response.data.message
        })
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
  FETCH_QUOTE(state, quote) {
    state.quote = quote
  },
  FETCH_ORDERS(state, orders) {
    state.orders = orders
  },
  SAVE_COMMENT(state, newComment) {
    state.quote.comment = newComment
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
