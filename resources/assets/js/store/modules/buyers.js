const state = {
  all: [],
  requestComplete: false
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
  getTotalOrdersEarningsByBuyerId: (state, getters) => id => {
    var sum = 0;
    var buyer = getters.getBuyerById(id);
    _.each(buyer.articles, (article) => {
      var details = getters.getAllArticles.find(art => {
        return parseInt(art.id) === parseInt(article.id)
      })
      if (details) {
        sum = sum + article.amount * details.returns;
      }
    });
    return sum;
  },
  getTotalOrdersWinnings: (state, getters) => {
    var buyers = getters.getAllBuyers
    var sum = 0
    buyers.forEach(buyer => {
      sum = sum + getters.getTotalOrdersPriceByBuyerId(buyer.id)
    })
    return sum
  },
  getTotalOrdersEarnings: (state, getters) => {
    var buyers = getters.getAllBuyers
    var sum = 0
    buyers.forEach(buyer => {
      sum = sum + getters.getTotalOrdersEarningsByBuyerId(buyer.id)
    })
    return sum
  },
  buyerHasArticle: (state, getters) => payload => {
    var articles = getters.getArticlesByBuyerId(payload.buyerId)
    var count = articles.length;
    articles.filter(article => {
      return parseInt(article.id) === parseInt(payload.articleId)
    })
    return count != articles.length
  },
  getArticlesByBuyerId: (state, getters) => id => {
    var buyer = getters.getBuyerById(id);
    return buyer.articles
  },
  getSummarizedArticles: (state, getters) => {
    var allBuyers = _.clone(getters.getAllBuyers)
    var allArticles = _.clone(getters.getAllArticles)
    var currArticle = null
    var amounts = []
    allBuyers.forEach(buyer => {
      var articles = getters.getArticlesByBuyerId(buyer.id)
      var totalAmount = 0
      articles.forEach(article => {
        if(!amounts[article.id]) {
          amounts[article.id] = 0
        }
        amounts[article.id] += article.amount
      })
    })

    amounts.forEach((amount, key) => {
      allArticles.forEach(article => {
        if(article.id == key) {
          article.amount = amount
        }
      })
    })

    return allArticles
  },
  getAllBuyers: (state, getters) => {
    return state.all
  }
}

const actions = {
  fetchBuyers({
    commit
  }, {
    self
  }) {
    self.$http
      .get("./api/order/123/buyers")
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
    state.requestComplete = true;
  },
  UPDATE_PART_PROPERTIES(state, payload) {
    console.log('ssssaaaavved')
  },
  changeArticleAmount(state, payload) {
    var buyer = state.all.find(buyer => {
      return parseInt(buyer.id) === parseInt(payload.buyerId)
    });
    var article = buyer.articles.find(article => article.id === payload.index)
    if(article.length > 1) {
      return false
    }
    article.amount = payload.value;
  },
  changeArticleId(state, payload) {
    var buyer = state.all.find(buyer => {
      return parseInt(buyer.id) === parseInt(payload.buyerId)
    });
    var article = buyer.articles.find(article => article.id === payload.oldId)
    article.id = parseInt(payload.newId)
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
