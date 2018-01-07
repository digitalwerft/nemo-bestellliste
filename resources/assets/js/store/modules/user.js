const state = {
  data: {},
  requestComplete: false
}

const getters = {
  getUser(state, getters) {
    return state.data
  }
}

const actions = {
  fetchUser({
    commit
  }, {
    self
  }) {
    self.$http
      .get("./api/user/123")
      .then(response => {
        commit("FETCH_USER", response.data);
      })
      .catch(error => {
        console.log(error);
      });
  }
}

const mutations = {
  FETCH_USER(state, user) {
    state.data = user;
    state.requestComplete = true;
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
