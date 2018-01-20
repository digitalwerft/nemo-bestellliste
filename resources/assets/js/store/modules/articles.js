const state = {
  all: [],
  requestComplete: false
}

const getters = {
  getArticleById: state => id => {
    return state.all.find(article => {
      return parseInt(article.id) === parseInt(id)
    });
  },
  getAllArticles: state => {
    return state.all
  }
}

const actions = {
  fetchArticles({
    commit
  }, {
    self
  }) {
    self.$http
      .get("./api/products")
      .then(response => {
        commit("FETCH_ARTICLES", response.data);
      })
      .catch(error => {
        console.log(error);
      });
  }
}

const mutations = {
  FETCH_ARTICLES(state, articles) {
    state.all = articles;
    state.requestComplete = true;
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
