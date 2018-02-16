import api from '../../services/api'
import iziToast from 'izitoast'

const state = {
  data: {},
  quote: {},
  requestComplete: false
}

const getters = {
  getCampaign(state, getters) {
    return state.data
  },
  getQuote(state) {
    return state.quote
  }
}

const actions = {
  fetchCampaign({
    commit
  }, {
    self
  }) {
    return api.fetchQuote(self.$route.params.id).then(quoteResponse => {
      commit('FETCH_QUOTE', quoteResponse.data)
      api.fetchCampaign(self.$route.params.id)
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
      api.saveComment(quote, newComment).then(response => {
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
