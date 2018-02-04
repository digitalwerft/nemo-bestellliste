<template>
  <div v-if="!isLoading" class="container">
    <div class="card mb-2">
      <div class="card-body">
        <router-link :to="{ name: 'campaign', id: $route.params.id }" class="btn btn-outline-primary"><i class="mdi mdi-lead-pencil">&nbsp;</i><span class="d-none d-sm-inline">Bestellliste</span> bearbeiten</router-link>
        <a href="#" class="btn btn-outline-primary float-right print-button">
          <i class="mdi mdi-printer">&nbsp;</i>Drucken
        </a>
      </div>
    </div>
    <div class="card">
      <div class="card-body pt-1">
        <div class="navbar pl-0 pr-0">
          <span class="navbar-brand">Zusammenfassung</span>
        </div>
        <hr>
        <table class="table table-bordered table-striped table-mobile">
          <thead class="thead-light">
            <tr>
              <th scope="col">
                <a href="#" @click.prevent="sort('number')">
                  Artikel
                  <i class="mdi" :class="{'mdi-chevron-up': reverseSort, 'mdi-chevron-down': !reverseSort}" v-if="sortBy=='number'"></i>
                </a>
              </th>
              <th scope="col">
                <a href="#" @click.prevent="sort('quantity')">
                  Anzahl Boxen
                  <i class="mdi" :class="{'mdi-chevron-up': reverseSort, 'mdi-chevron-down': !reverseSort}" v-if="sortBy=='quantity'"></i>
                </a>
              </th>
              <th scope="col">
                <a href="#" @click.prevent="sort('price')">
                  Rechnungsbetrag
                  <i class="mdi" :class="{'mdi-chevron-up': reverseSort, 'mdi-chevron-down': !reverseSort}" v-if="sortBy=='price'"></i>
                </a>
              </th>
              <th scope="col">
                <a href="#" @click.prevent="sort('returns')">
                  Spendensumme
                  <i class="mdi" :class="{'mdi-chevron-up': reverseSort, 'mdi-chevron-down': !reverseSort}" v-if="sortBy=='returns'"></i>
                </a>
              </th>
              <th scope="col">
                <a href="#" @click.prevent="sort('total')">
                  Gesamtbetrag
                  <i class="mdi" :class="{'mdi-chevron-up': reverseSort, 'mdi-chevron-down': !reverseSort}" v-if="sortBy=='total'"></i>
                </a>
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in sortedItems">
              <td data-label="Artikel">{{ item.number }} – {{ item.name }}</td>
              <td data-label="Anzahl Boxen">{{ item.quantity }}</td>
              <td data-label="Rechnungsbetrag">{{ item.quantity*item.gross_price }}€</td>
              <td data-label="Spende">{{ item.suggested_donation*item.quantity }}€</td>
              <td data-label="Gesamtbetrag">{{ getItemTotal(item) }}€</td>
            </tr>
            <tr class="tfooter">
              <td>Summe:</td>
              <td data-label="Anzahl der bestellten Boxen">{{ allItemsQuantity }}</td>
              <td data-label="Rechnungsbetrag">{{ allItemsPrice }}€</td>
              <td data-label="Gesamtsumme">{{ allItemsDonations }}€</td>
              <td data-label="Spendensumme">{{ allItemsPriceWithDonations }}€</td>
            </tr>
          </tbody>
        </table>
        <p>
          Rabattaktionen und Versandkosten (bei unter 100 bestellten Boxen) sind im o.g. Rechnungsbetrag noch nicht enthalten. <br>
          Voraussichtliche Versandkosten: {{ shippingCost }}€ <br>
        </p>
      </div>
    </div>
    <div class="card mt-2 print-view">
      <div class="card-body pt-1 pb-0">
        <div class="navbar navbar-expand pl-0 pr-0">
          <span class="navbar-brand">Teilnehmer</span>
          <ul class="navbar-nav">
            <li class="nav-item">
              <a href="#" class="btn btn-sm float-right" @click.prevent="showPrintList = !showPrintList" :class="{'btn-success': showPrintList, 'btn-light': !showPrintList}">
                <i class="mdi" :class="{'mdi-chevron-down': !showPrintList, 'mdi-chevron-up':  showPrintList}">&nbsp;</i>
                <span class="d-none d-sm-inline">{{ !showPrintList ? 'anzeigen' : 'verstecken'}}</span>
              </a>
            </li>
          </ul>
          <ul class="navbar-nav ml-auto">
            <li class="nav-item d-sm-none d-xs-list-item">
              <a href="#" class="btn btn-outline-primary mr-2" @click.prevent="showSearch = !showSearch"><i class="mdi mdi-magnify"></i></a>
            </li>
          </ul>
          <transition name="fade">
            <div class="form-inline ml-auto d-sm-none" v-if="showSearch">
              <input class="form-control" type="search" ref="searchInput-1" placeholder="Filtern" aria-label="Search" v-model="search" @input="updateSearch()" id="search-input">
              <a href="" class="mdi mdi-close-circle-outline clear-search" @click.prevent="clearSearch"></a>
            </div>
          </transition>
          <div class="form-inline ml-auto d-none d-sm-flex">
            <input class="form-control" type="search" ref="searchInput-2" placeholder="Filtern" aria-label="Search" v-model="search" @input="updateSearch()" id="search-input">
            <label for="search-input" class="search-icon" v-if="!search">
              <i class="mdi mdi-magnify"></i>
            </label>
            <a href="" class="mdi mdi-close-circle-outline clear-search" @click.prevent="clearSearch" :class="{hidden: (search=='')}"></a>
          </div>
        </div>

        <transition name="info-box">
          <div :style="style" class="print-list">
            <div class="print-list-container" ref="container">
              <hr>
              <div v-for="collector in filteredCollectors">
                <div class="table-responsive">
                  <table class="table table-bordered table-striped">
                    <thead class="thead-light">
                      <tr>
                        <th scope="col">Name</th>
                        <th scope="col">Artikel</th>
                        <th scope="col">Anzahl</th>
                        <th scope="col">Gesamtbetrag</th>
                        <th scope="col">Spende</th>
                        <th scope="col"><small>Boxen verteilt?</small></th>
                        <th scope="col"><small>Geld erhalten?</small></th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="(item, index) in collector.items">
                        <td data-label="Name" class="font-weight-bold" v-html="index == 0 ? highlight(collector.name) : ''">"</td>
                        <td data-label="Artikel">{{ item.number }} – {{ item.name}}</td>
                        <td data-label="Anzahl">{{ item.quantity }}</td>
                        <td data-label="Gesamtbetrag">{{ (parseFloat(item.suggested_donation)+parseFloat(item.gross_price)) * item.quantity }}€</td>
                        <td data-label="davon Spende">{{ item.suggested_donation * item.quantity}}€</td>
                        <td></td>
                        <td></td>
                      </tr>
                      <tr>
                        <td colspan="2"></td>
                        <td class="font-weight-bold">Summe:</td>
                        <td>{{ getPriceByCollectorId(collector.id) + getDonationsByCollectorId(collector.id)}}€</td>
                        <td>{{ getDonationsByCollectorId(collector.id) }}€</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </transition>
      </div>
    </div>
    <div class="card bg-danger-light mt-2 mb-2">
      <div class="card-body">
        Wenn ihr eure Bestellung abschickt, wird sie von uns gepackt und kann nicht mehr geändert werden. Nehmt euch daher bitte genügend Zeit, sie nochmals zu überprüfen. Nachbestellungen sind natürlich jederzeit möglich.
      </div>
    </div>
    <a href="#" @click.prevent="" class="btn btn-secondary btn-block btn-lg"><i class="mdi mdi-printer">&nbsp;</i><span class="d-none d-sm-inline">Zusammenfassung</span> drucken</a>
    <a href="#" @click.prevent="" class="btn btn-danger btn-block btn-lg">Bestellung jetzt aufgeben</a>
  </div>
</template>
<script>
  import store from '../store'
  import Navbar from '../components/navbar.vue'
  import SaveIndicator from '../components/save-indicator.vue'

  export default {
    components: {
      Navbar, SaveIndicator
    },
    store,
    created() {
      const store = this.$store
      const self  = { self: this }
      // If needed components are already loaded, stop execution
      if (store.getters.hasLoaded(['campaign', 'collectors'])) {
        return
      }

      this.showSpinner()

      store.dispatch('fetchCampaign', self)
        .then(() => {
          store.dispatch('fetchCollectors', self)
            .then(this.hideSpinner)
        })
    },
    data() {
      return {
        showPrintList: false,
        search: '',
        value: '',
        sortBy: 'number',
        reverseSort: false,
        showSearch: false,
        style: {
          height: 0
        }
      }
    },
    computed: {
      isLoading() {
        return !this.$store.getters.hasLoaded([
          'campaign',
          'collectors'
        ])
      },
      collectors() {
        return this.$store.getters.getAllCollectors
      },
      filteredCollectors() {
        var v = this.collectors.filter((collector) => {
          return _.lowerCase(collector.name).match(_.lowerCase(this.search))
        });
        return v;
      },
      sortedItems() {
        if(this.reverseSort) {
          return _.reverse(_.sortBy(this.items, this.sortBy))
        }
        return _.sortBy(this.items, this.sortBy)
      },
      items() {
        return this.$store.getters.getSummarizedItems
      },
      allItemsPriceWithDonations() {
        return this.$store.getters.getAllItemsPriceWithDonations
      },
      allItemsPrice() {
        return this.$store.getters.getAllItemsPrice
      },
      allItemsDonations() {
        return this.$store.getters.getAllItemsDonations
      },
      allItemsQuantity() {
        return this.$store.getters.getAllItemsQuantity
      },
      shippingCost() {
        var totalOrders = this.$store.getters.getTotalItemsQuantity
        if(totalOrders < 21 ) {
          return 4
        } else if(totalOrders) {
          return 8
        } else {
          return 0;
        }
      }
    },
    methods: {
      sort(key) {
        if(key == this.sortBy) {
          this.reverseSort = !this.reverseSort
        }
        else {
          this.sortBy = key
        }
      },
      getItemTotal(item) {
        return item.quantity*(parseFloat(item.gross_price)+parseFloat(item.suggested_donation))
      },
      sortByNumber(items) {
        return _.sortBy(this.items, 'number')
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
      },
      getSingleItemPrice(item) {
        return parseFloat(item.gross_price)+parseFloat(item.suggested_donation)
      },
      getItemByNumber(number) {
        return this.$store.getters.getItemByNumber(number)
      },
      getPriceByCollectorId(id) {
        return this.$store.getters.getTotalItemsPriceByCollectorId(id)
      },
      getDonationsByCollectorId(id) {
        return this.$store.getters.getAllItemsDonationsByCollectorId(id)
      },
      clearSearch() {
        this.search = ''
        this.showSearch = false
      },
      highlight(words) {
        // only highlight text if search term (this.filterkey) isn't empty
        if (this.search != '') {
          // match pattern for search term (i = ignore case, g = global match;
          // find all matches rather than stopping after the first match)
          var iQuery = new RegExp(this.search, "ig")
          // wrap matched term in <span class="highlight">$term</span>
          return words.toString().replace(iQuery, function(matchedTxt, a, b) {
            return ('<span class=\'highlight\'>' + matchedTxt + '</span>');
          })
        } else {
          // don't highlight anything if nothing was searched
          return words
        }
      },
      sortItems(items) {
        return items
      }
    },
    watch: {
      showPrintList(newVal, oldVal) {
        //console.log(this.$refs.container)
        if (newVal && this.$refs.container) {
          this.style.height = `${this.$refs.container.clientHeight + 16}px`
        } else {
          this.style.height = 0;
        }
      }
    }
  }
</script>
