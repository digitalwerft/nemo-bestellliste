<template>
  <div v-if="!isLoading" class="container summary-container" :class="{printing: printing}" v-shortkey="['meta', 'p']" @shortkey="print">
    <a href="#" class="btn btn-block btn-outline-secondary mb-3 d-none d-fake-print-block" @click.prevent="printDialog">
      <i class="mdi mdi-printer">&nbsp;</i>Drucken
    </a>
    <div class="card mb-2 d-print-none">
      <div class="card-body">
        <a href="#" @click.prevent="logout" class="btn btn-outline-danger ml-3 float-right"><i class="mdi mdi-logout">&nbsp;</i>abmelden</a>
        <router-link :to="{ name: 'campaign', id: $route.params.id }" class="btn btn-outline-primary float-right"><i class="mdi mdi-lead-pencil">&nbsp;</i><span class="d-none d-sm-inline">Liste</span> bearbeiten</router-link>
      </div>
    </div>

    <div class="card mb-2 d-print-no-border">
      <div class="card-body pt-4 pb-4 d-print-no-padding">
        <div class="shipping-address mb-0">
          <h6 class="card-title font-weight-bold">Lieferadresse</h6>
          {{ fundraiser.address.first_name }} {{ fundraiser.address.last_name }} <br>
          {{ fundraiser.address.address }} <br>
          {{ fundraiser.address.postal }}
        </div>
      </div>
    </div>

    <div class="card mb-2 d-print-no-border">
      <div class="card-body pt-0 print-border p-print mt-print">
        <h4 class="mb-4 mt-4">Aktuelle Bestellung</h4>
        <div class="quote" v-if="!isQuoteEmpty">
          <summary-table :collectors="collectors" :comment="comment" :isCurrent="true"></summary-table>
        </div>
      </div>
    </div>

    <div class="card bg-danger-light mt-2 mb-2 d-print-none" v-if="!isQuoteEmpty">
      <div class="card-body">
        Wenn du eure <strong>Bestellung abschickst</strong>, wird sie von uns gepackt und <strong>kann nicht mehr geändert werden</strong>. Sie kann in diesem Portal jederzeit eingesehen werden und du erhältst eine <strong>Bestell-Übersicht per E-Mail (als PDF Anhang)</strong>. Wir empfehlen, diese <strong>Übersicht auszudrucken und als Checkliste</strong> beim Verteilen der Boxen zu verwenden.
      </div>
    </div>

    <div class="row no-gutters">
      <div class="col">
        <a href="#" @click.prevent="showModal = true" class="btn btn-success btn-block btn-lg d-print-none mt-2" v-if="!isQuoteEmpty && !hasNoItems"><i class="mdi mdi-cart">&nbsp;</i>Bestellung jetzt aufgeben</a>
      </div>
    </div>

    <div class="row no-gutters">
      <div class="col">
        <router-link :to="{ name: 'campaign', id: $route.params.id }" class="btn btn-primary btn-block btn-lg d-print-none mt-2"><i class="mdi mdi-lead-pencil">&nbsp;</i>Liste bearbeiten</router-link>
      </div>
    </div>

    <div class="card mt-4 mb-2 orders d-print-no-border" v-if="orders.length > 0">
      <div class="card-body d-print-no-padding">
        <h4 class="mb-4 mt-print">Bereits abgeschlossene Bestellungen</h4>
        <div class="orders-list" v-for="(order, index) in orders">
          <div class="order print-border p-print mt-print">
            <h5 class="mt-4 mb-3 font-weight-bold">Bestellnr. #{{ order.identifier }} – {{ formatDate(order.created_at) }}</h5>
            <summary-table :collectors="order.quote.collectors" :comment="order.comment"></summary-table>
            <hr v-if="(index+1 != orders.length)">
          </div>
        </div>
      </div>
    </div>

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
      const modules = ['campaign', 'collectors', 'orders', 'fundraiser']
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

          if(this.printing) {
            setTimeout(() => {
              window.print()
            }, 1800)
          }
        })
    },
    data() {
      return {
        showModal: false
      }
    },
    computed: {
      printing() {
        if(this.$route.query.print == 1) {
          this.$store.commit('PRINTING')
          $('body').addClass('print')
        }
        return this.$route.query.print == 1
      },
      orders() {
        return this.$store.getters.getOrders
      },
      isLoading() {
        return !this.$store.getters.hasLoaded(['campaign', 'collectors', 'orders', 'fundraiser'])
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
      fundraiser() {
        return this.$store.getters.getFundraiser
      },
      isQuoteEmpty() {
        return this.$store.getters.isQuoteEmpty
      },
      hasNoItems() {
        return !this.$store.getters.getAllItemsQuantity(
          this.$store.getters.getAllCollectors
        )
      }
    },
    methods: {
      placeOrder() {
        this.$store.dispatch('placeOrder', {self: this}).then(response => {
          this.$store.commit('FORCE_RELOAD')
          this.$router.push({name: 'success'})
        }).catch(error => {
          utils.note.error({
            message: 'Ein Fehler ist aufgetreten. Bitte lade die Seite neu oder kontaktiere unser Team.'
          })
        })
      },
      print() {
        window.open(location.href + '?print=1')
      },
      printDialog() {
        window.print()
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
