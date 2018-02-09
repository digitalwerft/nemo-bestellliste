import itemsState from './items'
import axios from 'axios'

import iziToast from 'izitoast';

const api = {
  createItem(collector) {
    return axios.put('/api/campaign/'+collector.campaign_id+'/quote/collector/'+collector.id+'/item', {
        number: 110,
        quantity: 1
      })
  },
  updateItem(collector, item) {
    return axios.post('/api/campaign/'+collector.campaign_id+'/quote/collector/'+collector.id+'/item/'+item.id, {
      number: item.number,
      quantity: item.quantity
    })
  },
  deleteItem(collector, item) {
    return axios.delete('/api/campaign/'+collector.campaign_id+'/quote/collector/'+collector.id+'/item/'+item.id)
  },
  createCollector(collector) {
    return axios.put('/api/campaign/'+collector.campaign_id+'/quote/collector/', {
      name: collector.name
    })
  },
  deleteCollector(collector) {
    return axios.delete('/api/campaign/'+collector.campaign_id+'/quote/collector/'+collector.id)
  },
  updateCollector(collector) {
    return axios.post('/api/campaign/'+collector.campaign_id+'/quote/collector/'+collector.id, {
      name: collector.name
    })
  },
  updateAddress(fundraiser) {
    //
  },
  placeOrder() {
    //
  }
}

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
  },
  updateCollectorName({
    commit
  }, collector) {
    api.updateCollector(collector).then(response => {
      iziToast.success({
        message: response.data.message
      })
    }).catch(error => {
      if(error.response) {
        iziToast.error({
          message: error.response.data.message
        })
      }
    })
  },
  createCollector({
    commit
  }, collector) {
    console.log(collector)
    api.createCollector(collector).then(response => {
      commit('UPDATE_COLLECTOR_ID', {collector: collector, id: response.data.resources.id})
      iziToast.success({
        message: response.data.message
      })
    }).catch(error => {
      if(error.response) {
        iziToast.error({
          message: error.response.data.message
        })
      }
    })
  },
  deleteCollector({
    commit
  }, collector) {
    console.log(collector)
    api.deleteCollector(collector).then(response => {
      commit('DELETE_COLLECTOR', collector)
      iziToast.success({
        message: response.data.message ? response.data.message : 'Löschen erfolgreich'
      })
    }).catch(error => {
      if(error.response) {
        iziToast.error({
          message: error.response.data.message
        })
      }
    })
  },
  createItem({
    commit
  }, collector ) {
    api.createItem(collector).then(response => {
      commit("CREATE_ITEM", {collector: collector, response: response})
    }).catch(error => {
      if(error.response) {
        iziToast.error({
          message: error.response.data.message
        })
      }
    })
  },
  updateItemQuantity({
    commit
  }, {collector, itemObj, quantity}) {
    api.updateItem(collector, {number: itemObj.item.number, quantity: quantity, id: itemObj.item.id}).then(response => {
      commit('UPDATE_ITEM_QUANTITY', {collector: collector, item: itemObj.item, quantity: quantity})
    }).catch(error => {
      if(error.response) {
        iziToast.error({
          message: error.response.data.message
        })
      }
    })
  },
  updateItemNumber({
    commit
  }, {itemObj, collector, number}) {
    api.updateItem(collector, {number: number, quantity: itemObj.item.quantity, id: itemObj.item.id}).then(response => {
      commit('UPDATE_ITEM_NUMBER', {
        collector: collector,
        item: itemObj.item,
        number: number
      })
    }).catch(error => {
      if(error.response) {
        iziToast.error({
          message: error.response.data.message
        })
      }
    })
  },
  deleteItem({
    commit, state
  }, {
    itemObj, collector
  }) {
    return api.deleteItem(collector, itemObj.item)
      .then(response => {
        commit("DELETE_ITEM", {response: response.data, item: itemObj})
        iziToast.success({
          message: response.data.message ? response.data.message : 'Löschen erfolgreich'
        })
      }).catch(error => {
        if(error.response) {
          iziToast.error({
            message: error.response.data.message
          })
        }
      })
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
  UPDATE_ITEM_ID(state, payload) {
    payload.item.id = payload.id
  },
  UPDATE_ITEM_NUMBER(state, {collector, item, number}) {
    item.number = number
    var newItem = this.getters.getItemByNumber(number)
    _.unset(newItem, 'id')
    _.merge(item, newItem)
  },
  UPDATE_ITEM_QUANTITY(state, {collector, item, quantity}) {
    item.quantity = quantity;
  },
  changeItemNumber(state, payload) {
    var collector = this.getters.getCollectorById(payload.collectorId)
    var item = collector.items.find(item => item.id === payload.itemId)

    var newItem = this.getters.getItemByNumber(payload.newNumber);
    _.unset(newItem, 'id')
    _.merge(item, newItem)
  },
  UPDATE_ITEM(state, payload) {
      var collector = this.getters.getCollectorById(payload.item.collectorId)
      var item = collector.items.find(item => item.id === payload.item.item.id)
      var number = payload.newItem.number
      // If ID doesn't exist, the item to update is new
      if(item.length < 1) {
        return
      }

      var newItem = this.getters.getItemByNumber(number)
      _.unset(newItem, 'id')
      _.merge(item, newItem)
  },
  CREATE_ITEM(state, {collector, response}) {
    //var collector = this.getters.getCollectorById(collector.id)
    var newItem = this.getters.getItemByNumber(110)
    var item = {
      id: response.data.resource.id,
      quantity: 1,
      collector_id: collector.id,
      quote_id: collector.pivot.quote_id
    }
    _.unset(newItem, 'id')
    _.merge(item, newItem)

    collector.items.push(item);
  },
  START_DELETE(state) {
    state.deleting = true
    console.log(state)
  },
  END_DELETE(state) {
    state.deleting = false
  },
  DELETE_ITEM(state, { response, item }) {
    var collector = this.getters.getCollectorById(item.collectorId)
    collector.items.splice(item.index, 1);
  },
  resetItem(state, payload) {
    var collector = this.getters.getCollectorById(payload.collectorId)
    collector.state = 'changed'
    if (collector.items.length < 2) {
      collector.items[0].id = 0;
      collector.items[0].quantity = 1;
    }
  },
  UPDATE_COLLECTOR_NAME(state, {collector, newName}) {
    collector.name = newName
  },
  UPDATE_COLLECTOR_ID(state, {collector, id}) {
    collector.id = id
  },
  DELETE_COLLECTOR(state, collector) {
    state.all = state.all.filter(col => {
      return col.id != collector.id
    })
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
  CREATE_COLLECTOR(state) {
    state.all.push({
      items: [],
      name: '',
      id: 'new-collector-'+_.uniqueId(),
      state: 'new',
      campaign_id: state.all[0].campaign_id,
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
