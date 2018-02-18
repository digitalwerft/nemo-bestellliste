<template>
  <div v-if="!isLoading" class="container">
    <div class="card mb-2">
      <div class="card-body">
        <router-link :to="{ name: 'campaign', id: $route.params.id }" class="btn btn-outline-primary"><i class="mdi mdi-lead-pencil">&nbsp;</i><span class="d-none d-sm-inline">Bestellung</span> bearbeiten</router-link>
        <a href="#" class="btn btn-outline-primary float-right print-button">
          <i class="mdi mdi-printer">&nbsp;</i>Drucken
        </a>
      </div>
    </div>

    <div class="card mb-2 orders" v-if="orders">
      <div class="card-body pt-1">
        <div class="navbar pl-0 pr-0">
          <span class="navbar-brand">Vorherige Bestellungen</span>
        </div>
        <div class="orders-list" v-for="(order, index) in orders">
          <div class="order">
            <summary-table :collectors="order.quote.collectors" :comment="order.comment"></summary-table>
          </div>
          <hr v-if="index != 0">
        </div>
      </div>
    </div>
    <div class="quote">
      <summary-table :collectors="collectors" :comment="comment"></summary-table>
    </div>
    <div class="card bg-danger-light mt-2 mb-2">
      <div class="card-body">
        Wenn ihr eure Bestellung abschickt, wird sie von uns gepackt und kann nicht mehr geändert werden. Nehmt euch daher bitte genügend Zeit, sie nochmals zu überprüfen. Nachbestellungen sind natürlich jederzeit möglich.
      </div>
    </div>
    <a href="#" @click.prevent="" class="btn btn-secondary btn-block btn-lg"><i class="mdi mdi-printer">&nbsp;</i><span class="d-none d-sm-inline">Zusammenfassung</span> drucken</a>
    <router-link :to="{ name: 'campaign', id: $route.params.id }" class="btn btn-primary btn-block btn-lg"><i class="mdi mdi-lead-pencil">&nbsp;</i>Bestellung ändern</router-link>
    <a href="#" @click.prevent="" class="btn btn-danger btn-block btn-lg">Bestellung jetzt aufgeben</a>
  </div>
</template>
<script>
  import store from '../store'
  //import Navbar from '../components/navbar.vue'
  // import SaveIndicator from '../components/save-indicator.vue'
  import SummaryTable from '../components/summaryTable.vue'
  import utils from '../services/utils'

  export default {
    components: {
      SummaryTable
    },
    store,
    created() {
      const store = this.$store
      const self  = { self: this }
      // If needed components are already loaded, stop execution
      if (store.getters.hasLoaded(['campaign', 'collectors'])) {
        if(!store.getters.hasOrders) {
          store.dispatch('fetchOrders', self)
            .then(this.hideSpinner)
        }
        return
      }

      this.showSpinner()

      store.dispatch('fetchCampaign', self)
        .then(() => {
          store.dispatch('fetchCollectors', self)
            .then(() => {
                store.dispatch('fetchOrders', self)
                  .then(this.hideSpinner)
            })
        })
    },
    data() {
      return {}
    },
    computed: {
      orders() {
        return this.$store.state.campaign.orders
      },
      isLoading() {
        return !this.$store.getters.hasLoaded([
          'campaign',
          'collectors'
        ])
      },
      collectors() {
        return this.$store.getters.getAllCollectors
      },
      comment() {
        return this.$store.getters.getComment
      }
    },
    methods: {
      formatDate(date) {
        return utils.formatDate(date)
      },
      hideSpinner() {
        const spinner = $('.loading-overlay')
        setTimeout(() => {
          spinner.removeClass('loading')
          setTimeout(() => {
            spinner.addClass('hidden')
          }, 1000);
        }, 600);
      },
      showSpinner() {
        const spinner = $('.loading-overlay')
        spinner.removeClass('hidden')
        setTimeout(()=> {
          spinner.addClass('loading')
        }, 150)
      }
    }
  }
</script>
