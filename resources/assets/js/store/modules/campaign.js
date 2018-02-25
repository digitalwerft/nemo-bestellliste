import Api from '../../services/api'
import iziToast from 'izitoast'

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
  hasOrders(state) {
    return !_.isEmpty(state.orders)
  }
}

const actions = {
  fetchOrders({
    commit
  }, {
    self
  }) {
    return Api.fetchOrders(self.$route.params.id).then(response => {
      commit('FETCH_ORDERS', response.data)
    }).catch(error => {
      //
    })
  },
  fetchCampaign({
    commit
  }, {
    self
  }) {
    return Api.fetchQuote(self.$route.params.id).then(quoteResponse => {
      commit('FETCH_QUOTE', quoteResponse.data)
      Api.fetchCampaign(self.$route.params.id)
        .then(response => {
          commit('FETCH_CAMPAIGN', response.data)
          //resolve(response)
        }).catch(error => {
          //reject(error)
        })
      })
  },
  saveComment({
    commit
  }, {
    quote, newComment
  }) {
    commit('START_LOADING')
    return new Promise((resolve, reject) => {
      Api.saveComment(quote, newComment).then(response => {
        commit('SAVE_COMMENT', newComment)
        commit('STOP_LOADING')
        iziToast.success({
          message: 'Kommentar erfolgreich gespeichert.'
        })
        resolve(response)
      }).catch(error => {
        commit('ERROR_SAVING')
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
