<template>
  <div v-if="!isLoading" class="container" :class="{printing: printing}" v-shortkey="['meta', 'p']" @shortkey="print">
    <div class="card mb-2 d-print-none">
      <div class="card-body">
        <a href="#" @click.prevent="logout" class="btn btn-outline-danger ml-3 float-right"><i class="mdi mdi-logout">&nbsp;</i>abmelden</a>
        <router-link :to="{ name: 'campaign', id: $route.params.id }" class="btn btn-outline-primary"><i class="mdi mdi-lead-pencil">&nbsp;</i><span class="d-none d-sm-inline">Liste</span> bearbeiten</router-link>
        <a href="#" class="btn btn-outline-primary float-right print-button" @click.prevent="print">
          <i class="mdi mdi-printer">&nbsp;</i>Drucken
        </a>
      </div>
    </div>

    <div class="card mb-2 d-print-no-border">
      <div class="card-body pt-4 d-print-no-padding">
        <div class="quote" v-if="!isQuoteEmpty">
          <summary-table :collectors="collectors" :comment="comment" :isCurrent="true"></summary-table>
        </div>
      </div>
    </div>

    <div class="card mb-2 orders card d-print-no-border" v-if="orders.length > 0">
      <div class="card-body pt-1 d-print-no-padding">
        <div class="navbar pl-0 pr-0">
          <span class="navbar-brand">Bereits abgeschlossene Bestellungen</span>
        </div>
        <div class="orders-list" v-for="(order, index) in orders">
          <div class="order">
            <h6 class="mt-2 font-weight-bold">Bestellnr. #{{ order.identifier }}</h6>
            <summary-table :collectors="order.quote.collectors" :comment="order.comment"></summary-table>
            <hr v-if="(index+1 != orders.length)">
          </div>
        </div>
      </div>
    </div>
    <div class="card bg-danger-light mt-2 mb-2 d-print-none" v-if="!isQuoteEmpty">
      <div class="card-body">
        Wenn ihr eure Bestellung abschickt, wird sie von uns gepackt und kann nicht mehr geändert werden. Nehmt euch daher bitte genügend Zeit, sie nochmals zu überprüfen.
      </div>
    </div>

    <div class="row no-gutters">
      <div class="col">
        <router-link :to="{ name: 'campaign', id: $route.params.id }" class="btn btn-primary btn-block btn-lg d-print-none mt-2"><i class="mdi mdi-lead-pencil">&nbsp;</i>Liste bearbeiten</router-link>
      </div>
      <div class="col">
        <a href="#" @click.prevent="print" class="btn btn-secondary btn-block btn-lg d-print-none mt-2"><i class="mdi mdi-printer">&nbsp;</i><span class="d-none d-sm-inline">Zusammenfassung</span> drucken</a>
      </div>
    </div>
    <a href="#" @click.prevent="showModal = true" class="btn btn-success btn-block btn-lg d-print-none mt-2" v-if="!isQuoteEmpty"><i class="mdi mdi-cart">&nbsp;</i>Bestellung jetzt aufgeben</a>

    <modal v-if="showModal" @close="showModal = false" :large="true">
      <h4 slot="header"><strong>Bestellung bestätigen</strong></h4>
      <span slot="body">
        Bist du dir sicher, dass du die Bestellung jetzt aufgeben willst? Änderungen an der aktuellen Liste sind dann nicht mehr möglich. Wir empfehlen dir, lieber noch ein zweites Mal drüber zu schauen.
      </span>
      <div slot="footer" class="modal-footer">
        <a href="#" class="btn btn-danger btn-lg col" @click.prevent="showModal = false">abbrechen</a>
        <a href="#" class="btn btn-success btn-lg col" @click.prevent="placeOrder">bestellen</a>
      </div>
    </modal>

  </div>
</template>
<script>
  import store from '../store'
  import SummaryTable from '../components/summaryTable.vue'
  import utils from '../services/utils'
  import Modal from '../components/modal.vue'

  export default {
    components: {
      SummaryTable, Modal
    },
    store,
    created() {
      const store = this.$store
      const self  = { self: this }
      const modules = ['campaign', 'collectors', 'orders']
      let reload = this.forceReload
      var afterPrint = () => {
        this.$store.commit('RESET_ACTIONS')
      }

      if (window.matchMedia) {
        var mediaQueryList = window.matchMedia('print');
        mediaQueryList.addListener(mql => {
            if (mql.matches) {
                // beforePrint()
            } else {
                afterPrint()
            }
        })
      }

      window.onafterprint = afterPrint
      // If needed components are already loaded, stop execution
      if (store.getters.hasLoaded(modules) && !reload) {
        return
      }

      this.showSpinner()

      store.dispatch('fetchModules', {modules: modules, self: this, reload: reload})
        .then(response => {
          this.hideSpinner()
          store.commit('NO_RELOAD')
        })
    },
    data() {
      return {
        showModal: false
      }
    },
    computed: {
      printing() {
        return this.$store.state.action == 'PRINTING'
      },
      orders() {
        return this.$store.getters.getOrders
      },
      isLoading() {
        return !this.$store.getters.hasLoaded([
          'campaign',
          'collectors',
          'orders'
        ])
      },
      forceReload() {
        return this.$store.getters.forceReload
      },
      collectors() {
        return this.$store.getters.getAllCollectors
      },
      comment() {
        return this.$store.getters.getComment
      },
      isQuoteEmpty() {
        return this.$store.getters.isQuoteEmpty
      }
    },
    methods: {
      placeOrder() {
        this.$store.dispatch('placeOrder', {self: this}).then(response => {
          this.$store.commit('FORCE_RELOAD')
          this.$router.push({name: 'success', id: this.$route.params.id })
        }).catch(error => {
          utils.note.error({
            message: 'Ein Fehler ist aufgetreten. Bitte lade die Seite neu oder kontaktiere unser Team.'
          })
        })
      },
      print() {
        this.$store.commit('PRINTING')
        setTimeout(() => {
          window.print()
        }, 10)
      },
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
      logout() {
        this.$store.dispatch('logout').then(() => {
          this.$router.push({name: 'login'})
        })
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
