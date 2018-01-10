<template>
  <div class="container">
    <div class="card mb-2">
      <div class="card-body">
        <router-link :to="{ name: 'home'}" class="btn btn-outline-primary"><i class="mdi mdi-lead-pencil">&nbsp;</i>Bestellliste bearbeiten</router-link>
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
              <th scope="col">Artikel</th>
              <th scope="col">Menge</th>
              <th scope="col">Kaufpreis pro Box</th>
              <th scope="col">Rechnungsbetrag</th>
              <th scope="col">Spende</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="article in articles">
              <td data-label="Artikel">#{{ article.id }} – {{ article.name }}&nbsp;<span class="text-muted">({{ article.size}})</span></td>
              <td data-label="Menge">{{ article.amount }}</td>
              <td data-label="Kaufpreis pro Box">{{ article.price }}€</td>
              <td data-label="Rechnungsbetrag">{{ article.price*article.amount }}€</td>
              <td data-label="Spende">{{ article.returns*article.amount }}€</td>
            </tr>
            <tr class="tfooter">
              <td>Summe:</td>
              <td colspan="2" data-label="Anzahl der bestellten Boxen">{{ totalOrdersAmount }}</td>
              <td data-label="Rechnungsbetrag">{{ allArticlesSum }}€</td>
              <td data-label="Spendensumme">{{ allArticlesEarnings }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    <div class="card mt-2 print-view">
      <div class="card-body pt-1 pb-0">
        <div class="navbar pl-0 pr-0">
          <span class="navbar-brand">Zusammenfassung pro Teilnehmer</span>
          <div class="form-inline">
            <input class="form-control" type="search" ref="searchInput" placeholder="Suchen" aria-label="Search" :value="value" @input="updateSearch()" id="search-input">
            <label for="search-input" class="search-icon" v-if="!value">
              <i class="mdi mdi-magnify"></i>
            </label>
            <a href="" class="mdi mdi-close-circle-outline clear-search" @click="clearSearch" :class="{hidden: (value=='')}"></a>
          </div>
          <ul class="navbar-nav">
            <li class="nav-item">
              <a href="#" class="btn btn-sm float-right" @click="showPrintList = !showPrintList" :class="{'btn-success': showPrintList, 'btn-light': !showPrintList}">
                <i class="mdi" :class="{'mdi-chevron-down': !showPrintList, 'mdi-chevron-up':  showPrintList}">&nbsp;</i>{{ !showPrintList ? 'anzeigen' : 'verstecken'}}
              </a>
            </li>
          </ul>
        </div>

        <transition name="info-box">
          <div :style="style" class="print-list">
            <div class="print-list-container" ref="container">
              <hr>
              <div v-for="buyer in buyers">
                <div class="table-responsive">
                  <table class="table table-bordered table-striped">
                    <thead class="thead-light">
                      <tr>
                        <th scope="col">Name</th>
                        <th scope="col">Artikel</th>
                        <th scope="col">Stückpreis</th>
                        <th scope="col">Anzahl</th>
                        <th scope="col">Erlös</th>
                        <th scope="col">Summe</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="(article, index) in buyer.articles">
                        <td data-label="Name" class="font-weight-bold">{{ index == 0 ? buyer.name : '' }}</td>
                        <td data-label="Artikel">#{{ article.id }} – {{ getArticleById(article.id).name}}</td>
                        <td data-label="Stückpreis">{{ getArticleById(article.id).price }}€</td>
                        <td data-label="Anzahl">{{ article.amount }}</td>
                        <td data-label="Erlös">{{ getArticleById(article.id).returns * article.amount}}€</td>
                        <td data-label="Summe">{{ getArticleById(article.id).price * article.amount }}€</td>
                      </tr>
                      <tr>
                        <td colspan="4"></td>
                        <td class="font-weight-bold">Summe:</td>
                        <td>{{ getPriceByBuyerId(buyer.id)}}€</td>
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
        Wenn ihr eure Bestellung abschickt, wird sie umgehend von uns gepackt und kann nicht mehr geändert werden. Nehmt euch daher bitte genügend Zeit, sie nochmals zu überprüfen. Nachbestellungen sind natürlich jederzeit möglich.
      </div>
    </div>
    <a href="#" @click.prevent="" class="btn btn-secondary btn-block btn-lg"><i class="mdi mdi-printer">&nbsp;</i>Zusammenfassung drucken</a>
    <a href="#" @click.prevent="" class="btn btn-danger btn-block btn-lg">Bestellung jetzt abschließen</a>
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
    data() {
      return {
        showPrintList: false,
        search: '',
        value: '',
        style: {
          height: 0
        }
      }
    },
    computed: {
      user() {
        return this.$store.getters.getUser
      },
      buyers() {
        return this.$store.getters.getAllBuyers;
      },
      articles() {
        //console.log(this.$store.getters.getSummarizedArticles)
        return this.$store.getters.getSummarizedArticles
      },
      allArticlesSum() {
        return this.$store.getters.getTotalOrdersWinnings
      },
      allArticlesEarnings() {
        return this.$store.getters.getTotalOrdersEarnings
      },
      totalOrdersAmount() {
        return this.$store.getters.getTotalOrdersAmount
      },
      shippingCost() {
        var totalOrders = this.$store.getters.getTotalOrdersAmount
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
      getArticleById(id) {
        return this.$store.getters.getArticleById(id)
      },
      getPriceByBuyerId(id) {
        return this.$store.getters.getTotalOrdersPriceByBuyerId(id)
      },
      updateSearch() {

      },
      clearSearch() {

      }
    },
    watch: {
      showPrintList(newVal, oldVal) {
        console.log(this.$refs.container)
        if (newVal && this.$refs.container) {
          this.style.height = `${this.$refs.container.clientHeight + 16}px`
        } else {
          this.style.height = 0;
        }
      }
    }
  }
</script>
