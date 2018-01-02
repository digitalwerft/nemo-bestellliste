const state = {
  all: []
}

const getters = {
  getBuyerById: state => id => {
    return state.all.find(buyer => {
      return parseInt(buyer.id) === parseInt(id)
    });
  },
  getTotalOrdersAmount: (state, getters) => {
    var totalOrders = 0;
    state.all.forEach(buyer => {
      totalOrders += getters.getArticlesAmountByBuyerId(buyer.id)
    })
    return totalOrders
  },
  getArticlesAmountByBuyerId: (state, getters) => {
    return (id) => {
      var counter = 0;
      var buyer = getters.getBuyerById(id);
      _.each(buyer.articles, (article) => {
        counter = counter + article.amount;
      });
      return counter;
    }
  },
  getTotalOrdersPriceByBuyerId: (state, getters) => id => {
    var sum = 0;
    var buyer = getters.getBuyerById(id);
    _.each(buyer.articles, (article) => {
      var details = getters.getAllArticles.find(art => {
        return parseInt(art.id) === parseInt(article.id)
      })
      if (details) {
        sum = sum + article.amount * details.price;
      }
    });
    return sum;
  },
  getAllOrdersPrice: (state, getters) => {
    var buyers = state.all
    var sum = 0
    buyers.forEach(buyer => {
      sum = sum + getters.getTotalOrdersPriceByBuyerId(buyer.id)
    })
    return sum
  }
}

const actions = {
  fetchBuyers({
    commit
  }, {
    self
  }) {
    self.$http
      .get("/api/order/123/buyers")
      .then(response => {
        commit("FETCH_BUYERS", response.data);
      })
      .catch(error => {
        console.log(error);
      });
  }
}

const mutations = {
  FETCH_BUYERS(state, buyers) {
    state.all = buyers;
  },
  changeArticleAmount(state, payload) {
    var buyer = state.all.find(buyer => {
      return parseInt(buyer.id) === parseInt(payload.buyerId)
    });
    var article = buyer.articles.find(article => article.id === payload.index)
    article.amount = payload.value;
  },
  changeArticleId(state, payload) {
    var buyer = state.all.find(buyer => {
      return parseInt(buyer.id) === parseInt(payload.buyerId)
    });
    var article = buyer.articles.find(article => article.id === payload.oldId)
    article.id = payload.newId
  },
  newArticle(state, payload) {
    var buyer = state.all.find(buyer => {
      return parseInt(buyer.id) === parseInt(payload.buyerId)
    });
    buyer.articles.push({
      id: 0,
      amount: 1
    });
  },
  deleteArticle(state, payload) {
    var buyer = state.all.find(buyer => {
      return parseInt(buyer.id) === parseInt(payload.buyerId)
    });
    buyer.articles.splice(payload.articleIndex, 1);
  },
  resetArticle(state, payload) {
    var buyer = state.all.find(buyer => {
      return parseInt(buyer.id) === parseInt(payload.buyerId)
    });
    if (buyer.articles.length < 2) {
      buyer.articles[0].id = 0;
      buyer.articles[0].amount = 1;
    }
  },
  updateBuyerName(state, payload) {
    payload.buyer.name = payload.newName
  },
  'delete-buyer'(state, payload) {
    state.all = state.all.filter(buyer => {
      return buyer.id != payload.buyer.id
    });
  },
  newBuyer(state) {
    state.all.push({
      articles: [],
      name: '',
      state: 'active',
      id: Math.floor((Math.random() * 1110) + 1)
    })
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
