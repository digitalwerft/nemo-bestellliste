const state = {
  all: [],
  requestComplete: false
}

const getters = {
  getArticleByNumber: state => number => {
    return state.all.find(article => {
      return article.number == number
    });
  },
  getAllArticles: state => {
    return state.all
  },
  getAllArticleNumbers: state => {
    var numbers = []
    state.all.forEach(article => {
      numbers.push(article.data.number)
    })
    return numbers
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
