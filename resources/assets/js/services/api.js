import axios from 'axios'
import Auth from './auth'


axios.defaults.headers.common['Authorization'] = 'Bearer ' + Auth.apiToken()

function req() {
  const token = Auth.apiToken()

  if (!token) {
    return axios
  }

  return axios.create({
    headers: {
      common: {Authorization: 'Bearer ' + token}
    }
  })
}

export default {
  createItem(collector, number, quantity) {
    return req().post('/api/campaign/'+collector.campaign_id+'/quote/collector/'+collector.id+'/item', {
        number: number,
        quantity: quantity
      })
  },
  updateItem(collector, item) {
    return req().post('/api/campaign/'+collector.campaign_id+'/quote/collector/'+collector.id+'/item/'+item.id, {
      number: item.number,
      quantity: item.quantity
    })
  },
  deleteItem(collector, item) {
    return req().delete('/api/campaign/'+collector.campaign_id+'/quote/collector/'+collector.id+'/item/'+item.id)
  },
  createCollector(collector) {
    return req().post('/api/campaign/'+collector.campaign_id+'/quote/collector/', {
      name: collector.name
    })
  },
  deleteCollector(collector) {
    return req().delete('/api/campaign/'+collector.campaign_id+'/quote/collector/'+collector.id)
  },
  updateCollector(collector) {
    return req().post('/api/campaign/'+collector.campaign_id+'/quote/collector/'+collector.id, {
      name: collector.name
    })
  },
  updateShippingAddress(campaign_id, address) {
    const form_data = _.pick(address, [
      'city', 'zip_code', 'first_name', 'last_name', 'route', 'street_number', 'organisation'
    ])
    return req().post('/api/campaign/'+campaign_id+'/shipping-address', {
      address: form_data
    })
  },
  fetchQuote(campaign_id) {
    return req().get('/api/campaign/'+campaign_id+'/quote/')
  },
  fetchCollectors(campaign_id) {
    return req().get('/api/campaign/'+campaign_id+'/quote/collectors/')
  },
  fetchCampaign(campaign_id) {
    return req().get('/api/campaign/'+campaign_id)
  },
  fetchCampaigns() {
    return req().get('/api/campaigns')
  },
  saveComment(quote, newComment) {
    return req().post('/api/campaign/'+quote.campaign_id+'/quote', {
      comment: newComment
    })
  },
  fetchOrders(campaign_id) {
    return req().get('/api/campaign/'+campaign_id+'/orders')
  },
  fetchFundraiser() {
    return req().get('/api/fundraiser')
  },
  fetchProducts() {
    return req().get("/api/products")
  },
  placeOrder(campaign_id) {
    return req().post('api/campaign/'+campaign_id+'/order')
  },
  login(code) {
    return axios.get('/api/login?auth-code=' + code)
  },
  logout() {
    return axios.get('/api/logout')
  }
}
