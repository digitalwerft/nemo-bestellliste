import Api from '../../services/api'

const state = {
  all: [],
  requestComplete: false
}

const getters = {
  getItemByNumber: state => number => {
    return state.all.find(item => {
      return item.number == number
    });
  },
  getAllItems: state => {
    return state.all
  },
  getAllItemNumbers: state => {
    var numbers = []
    state.all.forEach(item => {
      numbers.push(item.number)
    })
    return numbers
  }
}

const actions = {
  fetchItems({
    commit, dispatch
  }, {
    self
  }) {
    commit('START_LOADING', 'FETCHING_PRODUCTS')
    return new Promise((resolve, reject) => {
      Api.fetchProducts()
        .then(response => {
          commit("FETCH_ITEMS", response.data)
          commit('STOP_LOADING', 'FETCHED_PRODUCTS')
          resolve(response)
        })
        .catch(error => {
          commit('REQUEST_ERROR', 'FETCHING_PRODUCTS')
          dispatch('logout')
          reject(error)
        })
    })
  }
}

const mutations = {
  FETCH_ITEMS(state, items) {
    state.all = items;
    state.requestComplete = true;
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
