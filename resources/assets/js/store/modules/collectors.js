import itemsState from './items'

const state = {
  all: [],
  requestComplete: false
}

const getters = {
  getCollectorById: state => id => {
    return state.all.find(collector => {
      return collector.id === id
    });
  },
  getAllItemsQuantity: (state, getters) => {
    var totalOrders = 0;
    state.all.forEach(collector => {
      totalOrders += getters.getItemsQuantityByCollectorId(collector.id)
    })
    return totalOrders
  },
  getItemsQuantityByCollectorId: (state, getters) => {
    return (id) => {
      var counter = 0;
      var collector = getters.getCollectorById(id);
      _.each(collector.items, (item) => {
        counter = counter + item.quantity;
      });
      return counter;
    }
  },
  getTotalItemsPriceByCollectorId: (state, getters) => {
    return (id) => {
      var sum = 0;
      var collector = getters.getCollectorById(id);
      _.each(collector.items, (item) => {
        sum = sum + item.quantity * item.gross_price;
      });
      return sum;
    }
  },
  getAllItemsDonationsByCollectorId: (state, getters) => id => {
    var sum = 0;
    var collector = getters.getCollectorById(id);
    _.each(collector.items, (item) => {
        sum += item.quantity * item.suggested_donation;
    });
    return sum;
  },
  getAllItemsPrice: (state, getters) => {
    var collectors = getters.getAllCollectors
    var sum = 0
    collectors.forEach(collector => {
      sum = sum + getters.getTotalItemsPriceByCollectorId(collector.id)
    })
    return sum
  },
  getAllItemsPriceWithDonations: (state, getters) => {
    var collectors = getters.getAllCollectors
    var price = 0
    collectors.forEach(collector => {
      price = price + getters.getTotalItemsPriceByCollectorId(collector.id) + getters.getAllItemsDonationsByCollectorId(collector.id)
    })
    return price
  },
  getAllItemsDonations: (state, getters) => {
    var collectors = getters.getAllCollectors
    var sum = 0
    collectors.forEach(collector => {
      sum = sum + getters.getAllItemsDonationsByCollectorId(collector.id)
    })
    return sum
  },
  collectorHasItem: (state, getters) => payload => {
    var items = getters.getItemsByCollectorId(payload.collectorId)
    var count = items.length;
    items.filter(item => {
      return item.number == payload.itemNumber
    })
    return count != items.length
  },
  getItemsByCollectorId: (state, getters) => id => {
    var collector = getters.getCollectorById(id);
    return _.sortBy(collector.items, 'number')
  },
  getSummarizedItems: (state, getters) => {
    var allCollectors = getters.getAllCollectors
    var summarizedItems = []

    allCollectors.forEach(collector => {
      collector.items.forEach(item => {
        var itemExists = _.findIndex(summarizedItems, i => {
          return(i.number === item.number)
        })
        if(itemExists > 0) {
          summarizedItems[itemExists].quantity += item.quantity
        } else {
          summarizedItems.push({
            quantity: item.quantity,
            number: item.number,
            vat: item.vat,
            gross_price: item.gross_price,
            suggested_donation: item.suggested_donation,
            name: item.name
          })
        }
      })
    })
    return summarizedItems
  },
  getAllCollectors: (state, getters) => {
    return state.all
  },
  getRootItemByNumber: (state, getters, rootState) => number => {
    return rootState.getters.getItemByNumber(number);
  }
}

const actions = {
  fetchCollectors({
    commit
  }, {
    self
  }) {
    self.$http
      .get("./api/campaign/"+self.$route.params.id+"/quote/collectors")
      .then(response => {
        commit("FETCH_COLLECTORS", response.data);
      })
      .catch(error => {
        console.log(error);
      });
  }
}

const mutations = {
  FETCH_COLLECTORS(state, collectors) {
    collectors.forEach(collector => {
      collector.state = 'saved'
    })
    state.all = collectors;
    state.requestComplete = true;
  },
  changeItemQuantity(state, payload) {
    var collector = this.getters.getCollectorById(payload.collectorId)
    var item = collector.items.find(item => item.id === payload.itemId)

    if(item.length > 1) {
      return false
    }

    item.quantity = payload.newQuantity;
  },
  changeItemNumber(state, payload) {
    var collector = this.getters.getCollectorById(payload.collectorId)
    var item = collector.items.find(item => item.id === payload.itemId)

    var newItem = this.getters.getItemByNumber(payload.newNumber);
    _.unset(newItem, 'id')
    _.merge(item, newItem)
  },
  newItem(state, payload) {
    var collector = this.getters.getCollectorById(payload.collectorId)
    console.log(collector)
    collector.items.push({
      id: 'new-id-'+_.uniqueId(),
      quantity: 1,
      collector_id: payload.collectorId,
      quote_id: collector.pivot.quote_id,
      gross_price: 0,
      name: 'keine Auswahl',
      suggested_donation: 0
    });
  },
  deleteItem(state, payload) {
    var collector = this.getters.getCollectorById(payload.collectorId)
    collector.state = 'changed'
    collector.items.splice(payload.itemIndex, 1);
  },
  resetItem(state, payload) {
    var collector = this.getters.getCollectorById(payload.collectorId)
    collector.state = 'changed'
    if (collector.items.length < 2) {
      collector.items[0].id = 0;
      collector.items[0].quantity = 1;
    }
  },
  updateCollectorName(state, payload) {
    payload.collector.name = payload.newName
    payload.collector.state = 'changed'
  },
  'delete-collector'(state, payload) {
    state.all = state.all.filter(collector => {
      return collector.id != payload.collector.id
    });
    // perform immediate server request
  },
  saveCollector(state, id) {
    // perform Collector Update
    var collector = state.all.find(collector => {
      return parseInt(collector.id) === parseInt(id)
    });
  },
  saveAllCollectors(state) {
    //
  },
  newCollector(state) {
    state.all.push({
      items: [],
      name: '',
      id: 'new-collector-'+_.uniqueId(),
      state: 'new',
      pivot: {
        quote_id: state.all[0].pivot.quote_id
      }
    })
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
