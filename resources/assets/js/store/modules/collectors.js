import Api from '../../services/api'

import iziToast from 'izitoast'

const state = {
  all: [],
  requestComplete: false
}

function stopLoading(commit, lastAction = 'NONE', withError = false, timeout = 500) {
  setTimeout(() => {
    commit('STOP_LOADING', lastAction)
    if (withError) {
      commit('ERROR_SAVING', lastAction)
    }
  }, timeout)
}

const getters = {
  getCollectorById: state => id => {
    return state.all.find(collector => {
      return collector.id === id
    });
  },
  hasUnsavedItems: state => {
    var unsaved = state.all.find(collector => {
      return collector.items.find(item => {
        return _.startsWith(item.id, 'new-item')
      })
    })

    return unsaved ? true : false
  },
  getAllItemsQuantity: (state, getters) => (collectors = false) => {
    if (!collectors) {
      collectors = getters.getAllCollectors
    }
    var totalOrders = 0;
    collectors.forEach(collector => {
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
  getAllItemsPrice: (state, getters) => (collectors = false) => {
    if (!collectors) {
      collectors = getters.getAllCollectors
    }
    var sum = 0
    collectors.forEach(collector => {
      sum = sum + getters.getTotalItemsPriceByCollectorId(collector.id)
    })
    return sum
  },
  getAllItemsPriceWithDonations: (state, getters) => (collectors = false) => {
    if (!collectors) {
      collectors = getters.getAllCollectors
    }
    var price = 0
    collectors.forEach(collector => {
      price = price + getters.getTotalItemsPriceByCollectorId(collector.id) + getters.getAllItemsDonationsByCollectorId(collector.id)
    })
    return price
  },
  getAllItemsDonations: (state, getters) => (collectors = false) => {
    if (!collectors) {
      collectors = getters.getAllCollectors
    }
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
          return (i.number === item.number)
        })
        if (itemExists > 0) {
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
    commit('START_LOADING', 'FETCHING_COLLECTORS')
    Api.fetchCollectors(self.$route.params.id)
      .then(response => {
        commit("FETCH_COLLECTORS", response.data);
        stopLoading(commit, 'FETCHED_COLLECTORS')
      })
      .catch(error => {
        console.log(error);
        commit('REQUEST_ERROR', 'FETCHED_COLLECTORS')
      })
  },
  updateShippingAddress({
    commit
  }, {
    campaign_id,
    address
  }) {
    commit('START_LOADING', 'UPDATING_SHIPPING_ADDRESS')
    return Api.updateShippingAddress(campaign_id, address).then(response => {
      commit('UPDATE_SHIPPING_ADDRESS', address)
      stopLoading(commit, 'UPDATED_SHIPPING_ADDRESS')
    }).catch(error => {
      stopLoading(commit, 'UPDATE_SHIPPING_ADDRESS', true)
      if (error.response) {
        iziToast.error({
          message: error.response.data.message
        })
      }
    })
  },
  updateCollectorName({
    commit,
    rootState
  }, collector) {
    commit('START_LOADING', 'SAVING_COLLECTOR')
    return Api.updateCollector(collector).then(response => {
      stopLoading(commit, 'UPDATED_COLLECTOR_NAME')
      iziToast.success({
        message: response.data.message
      })
    }).catch(error => {
      stopLoading(commit, 'UPDATED_COLLECTOR_NAME', true)
      if (error.response) {
        iziToast.error({
          message: error.response.data.message
        })
      }
    })
  },
  createCollector({
    commit
  }, collector) {
    commit('START_LOADING', 'CREATING_COLLECTOR')
    return new Promise((resolve, reject) => {
      Api.createCollector(collector).then(response => {
        commit('UPDATE_COLLECTOR_ID', {
          collector: collector,
          id: response.data.data.resource.id
        })
        stopLoading(commit, 'CREATED_COLLECTOR')
        resolve()
        iziToast.success({
          message: response.data.message
        })
      }).catch(error => {
        stopLoading(commit, 'CREATED_COLLECTOR', true)
        reject()
        if (error.response) {
          iziToast.error({
            message: error.response.data.message
          })
        }
      })
    })
  },
  deleteCollector({
    commit
  }, collector) {
    if (collector.state == 'new') {
      commit('DELETE_COLLECTOR', collector)
      stopLoading(commit, 'DELETED_COLLECTOR')
      return
    }
    commit('START_LOADING', 'DELETING_COLLECTOR')
    return new Promise((resolve, reject) => {
      return Api.deleteCollector(collector).then(response => {
        commit('DELETE_COLLECTOR', collector)
        stopLoading(commit, 'DELETED_COLLECTOR')
        resolve()
        iziToast.success({
          message: response.data.message ? response.data.message : 'Löschen erfolgreich'
        })
      }).catch(error => {
        stopLoading(commit, 'DELETED_COLLECTOR', true)
        reject()
        if (error.response) {
          iziToast.error({
            message: error.response.data.message
          })
        }
      })
    })
  },
  createItem({
    commit
  }, {
    collector,
    item,
    newNumber,
    quantity
  }) {
    commit('START_LOADING', 'CREATING_ITEM')
    return new Promise((resolve, reject) => {
      return Api.createItem(collector, newNumber, 1).then(response => {
        commit("UPDATE_ITEM_ID", {
          item: item,
          newId: response.data.data.resource.id
        })
        commit('UPDATE_ITEM_NUMBER', {
          collector: collector,
          item: item,
          number: response.data.data.resource.number
        })
        commit('UPDATE_ITEM_QUANTITY', {
          collector: collector,
          item: item,
          quantity: quantity
        })
        stopLoading(commit, 'CREATED_ITEM')
        resolve()
      }).catch(error => {
        stopLoading(commit, 'CREATED_ITEM', true)
        reject()
        if (error.response) {
          iziToast.error({
            message: error.response.data.message
          })
        }
      })
    })
  },
  updateItemQuantity({
    commit
  }, {
    collector,
    itemObj,
    quantity
  }) {
    commit('START_LOADING', 'SAVING_ITEM')
    return new Promise((resolve, reject) => {
      return Api.updateItem(collector, {
        number: itemObj.item.number,
        quantity: quantity,
        id: itemObj.item.id
      }).then(response => {
        commit('UPDATE_ITEM_QUANTITY', {
          collector: collector,
          item: itemObj.item,
          quantity: quantity
        })
        stopLoading(commit, 'UPDATED_ITEM_QUANTITY')
        resolve()
      }).catch(error => {
        stopLoading(commit, 'UPDATED_ITEM_QUANTITY', true)
        reject()
        if (error.response) {
          iziToast.error({
            message: error.response.data.message
          })
        }
      })
    })
  },
  updateItemNumber({
    commit
  }, {
    itemObj,
    collector,
    number
  }) {
    commit('START_LOADING', 'SAVING_ITEM')
    return new Promise((resolve, reject) => {
      return Api.updateItem(collector, {
        number: number,
        quantity: itemObj.item.quantity,
        id: itemObj.item.id
      }).then(response => {
        commit('UPDATE_ITEM_NUMBER', {
          collector: collector,
          item: itemObj.item,
          number: number
        })
        stopLoading(commit, 'UPDATED_ITEM_NUMBER')
        resolve()
      }).catch(error => {
        stopLoading(commit, 'UPDATED_ITEM_NUMBER', true)
        reject()
        if (error.response) {
          iziToast.error({
            message: error.response.data.message
          })
        }
      })
    })
  },
  deleteItem({
    commit,
    state
  }, {
    itemObj,
    collector
  }) {
    commit('START_LOADING', 'DELETING_ITEM')
    return new Promise((resolve, reject) => {
      return Api.deleteItem(collector, itemObj.item)
        .then(response => {
          commit("DELETE_ITEM", itemObj)
          iziToast.success({
            message: response.data.message ? response.data.message : 'Löschen erfolgreich'
          })
          stopLoading(commit, 'DELETED_ITEM')
          resolve()
        }).catch(error => {
          stopLoading(commit, 'DELETED_ITEM', true)
          reject()
          if (error.response) {
            iziToast.error({
              message: error.response.data.message
            })
          }
        })
    })
  }
}

const mutations = {
  FETCH_COLLECTORS(state, collectors) {
    state.all = collectors
    state.requestComplete = true
  },
  UPDATE_ITEM_ID(state, {
    item,
    newId
  }) {
    item.id = newId
  },
  UPDATE_ITEM_NUMBER(state, {
    collector,
    item,
    number
  }) {
    item.number = number
    var newItem = this.getters.getItemByNumber(number)
    _.unset(newItem, 'id')
    _.merge(item, newItem)
  },
  UPDATE_ITEM_QUANTITY(state, {
    collector,
    item,
    quantity
  }) {
    item.quantity = quantity
  },
  changeItemNumber(state, payload) {
    var collector = this.getters.getCollectorById(payload.collectorId)
    var item = collector.items.find(item => item.id === payload.itemId)

    var newItem = this.getters.getItemByNumber(payload.newNumber);
    _.unset(newItem, 'id')
    _.merge(item, newItem)
  },
  UPDATE_ITEM(state, {
    payload
  }) {
    var collector = this.getters.getCollectorById(payload.item.collectorId)
    var item = collector.items.find(item => item.id === payload.item.item.id)
    var number = payload.newItem.number
    // If ID doesn't exist, the item to update is new
    if (item.length < 1) {
      return
    }

    var newItem = this.getters.getItemByNumber(number)
    _.unset(newItem, 'id')
    _.merge(item, newItem)
  },
  CREATE_ITEM(state, collector) {
    //var defaultItem = this.getters.getItemByNumber(110)
    var newItem = {
      id: 'new-item-' + _.uniqueId(),
      quantity: 1,
      collector_id: collector.id,
      quote_id: collector.pivot.quote_id,
      number: 0,
      name: 'keine Auswahl',
      gross_price: 0,
      suggested_donation: 0
    }
    //  _.unset(defaultItem, 'id')
    //_.merge(newItem, defaultItem)
    collector.items.push(newItem)
  },
  CREATE_EMPTY_ITEM(state, {
    collector,
    item
  }) {
    var defaultItem = this.getters.getItemByNumber(110)
    var newItem = {
      id: item.id,
      quantity: 1,
      collector_id: collector.id,
      quote_id: collector.pivot.quote_id,
      number: 0,
      name: 'keine Auswahl',
      gross_price: 0,
      suggested_donation: 0
    }
    _.unset(defaultItem, 'id')
    _.merge(newItem, defaultItem)
    collector.items.push(newItem)

  },
  START_DELETE(state) {
    state.deleting = true
    console.log(state)
  },
  END_DELETE(state) {
    state.deleting = false
  },
  DELETE_ITEM(state, item) {
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
  UPDATE_COLLECTOR_NAME(state, {
    collector,
    newName
  }) {
    collector.name = newName
  },
  UPDATE_COLLECTOR_ID(state, {
    collector,
    id
  }) {
    collector.id = id
    if (collector.state) {
      _.unset(collector, 'state')
    }
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
  CREATE_COLLECTOR(state, campaign_id) {
    state.all.push({
      items: [],
      name: '',
      id: 'new-collector-' + _.uniqueId(),
      state: 'new',
      campaign_id: campaign_id
    })
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
