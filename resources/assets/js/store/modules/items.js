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
    commit
  }, {
    self
  }) {
    self.$http
      .get("./api/products")
      .then(response => {
        commit("FETCH_ITEMS", response.data);
      })
      .catch(error => {
        //console.log(error);
      });
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
