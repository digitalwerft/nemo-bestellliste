import axios from 'axios'

export default {
  createItem(collector) {
    return axios.post('/api/campaign/'+collector.campaign_id+'/quote/collector/'+collector.id+'/item', {
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
    return axios.post('/api/campaign/'+collector.campaign_id+'/quote/collector/', {
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
  updateShippingAddress(campaign_id, address) {
    const form_data = _.pick(address, [
      'city', 'zip_code', 'first_name', 'last_name', 'route', 'street_number', 'organisation'
    ])
    return axios.post('/api/campaign/'+campaign_id+'/shipping-address', {
      address: form_data
    })
  },
  placeOrder() {
    //
  }
}
