const state = {
  data: {}
}

const getters = {}

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
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
