<template>
  <div>
    <div class="card d-print-no-border">
      <div class="card-body pt-1 pb-3">
        <div class="navbar pl-0 pr-0">
          <span class="navbar-brand">Zusammenfassung <span v-if="isCurrent">der aktuellen Bestelliste</span></span>
          <ul class="navbar-nav ml-auto d-print-none">
            <li class="nav-item">
              <a href="#" class="btn btn-sm" @click.prevent="showSummary = !showSummary" :class="{'btn-success': showSummary, 'btn-light': !showSummary}">
                <i class="mdi" :class="{'mdi-chevron-down': !showSummary, 'mdi-chevron-up':  showSummary}">&nbsp;</i>
                <span class="d-none d-sm-inline">{{ !showSummary ? 'anzeigen' : 'verstecken'}}</span>
              </a>
            </li>
          </ul>
        </div>
        <small class="text-muted" v-if="comment">Kommentar: &bdquo;{{ comment }}&ldquo;</small>
        <transition name="info-box">
          <div class="print-list" :style="style.summary">
            <div class="print-list-container" ref="summary-container">
              <hr>
              <div class="summary-table-container">
                <table class="table table-bordered table-striped table-mobile" :class="{printing: printing}">
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
                        <a href="#" @click.prevent="sort('invoice')" title="Der Rechnungsbetrag für die bestellten Produkte">
                          Rechnungsbetrag
                          <i class="mdi" :class="{'mdi-chevron-up': reverseSort, 'mdi-chevron-down': !reverseSort}" v-if="sortBy=='invoice'"></i>
                        </a>
                      </th>
                      <th scope="col">
                        <a href="#" @click.prevent="sort('returns')" title="Die Spende bleibt bei eurem Projekt und wird nicht überwiesen">
                          Spendensumme
                          <i class="mdi" :class="{'mdi-chevron-up': reverseSort, 'mdi-chevron-down': !reverseSort}" v-if="sortBy=='returns'"></i>
                        </a>
                      </th>
                      <th scope="col">
                        <a href="#" @click.prevent="sort('total')" title="Dieser Betrag wird von den Teilnehmern eingesammelt">
                          Gesamtbetrag
                          <i class="mdi" :class="{'mdi-chevron-up': reverseSort, 'mdi-chevron-down': !reverseSort}" v-if="sortBy=='total'"></i>
                        </a>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="item in sortedItems">
                      <td data-label="Artikel-Nr.">{{ item.number }}<span class="d-none d-md-inline d-print-none"> – {{ item.name }}</span></td>
                      <td data-label="Anzahl Boxen">{{ item.quantity }}</td>
                      <td data-label="Rechnungsbetrag">{{ item.quantity*item.gross_price }}€</td>
                      <td data-label="Spende">{{ item.suggested_donation*item.quantity }}€</td>
                      <td data-label="Gesamtbetrag">{{ getItemTotal(item) }}€</td>
                    </tr>
                    <tr class="footer-header">
                      <td scope="col" class="text-muted">
                          Artikel
                      </td>
                      <td scope="col" class="text-muted">
                          Anzahl Boxen
                      </td>
                      <td scope="col" class="text-muted">
                          Rechnungsbetrag
                      </td>
                      <td scope="col" class="text-muted">
                        Spendensumme
                      </td>
                      <td scope="col" class="text-muted">
                          Gesamtbetrag
                      </td>
                    </tr>
                    <tr class="tfooter">
                      <td>Summe:</td>
                      <td data-label="Anzahl der bestellten Boxen">{{ getAllItemsQuantity() }}</td>
                      <td data-label="Rechnungsbetrag">{{ getAllItemsPrice() }}€</td>
                      <td data-label="Spendensumme">{{ getAllItemsDonations() }}€</td>
                      <td data-label="Gesamtbetrag">{{ getAllItemsPriceWithDonations() }}€</td>
                    </tr>
                  </tbody>
                </table>
                <p class="d-print-none">
                  Aktionen und Versandkosten (bei unter 100 bestellten Boxen) sind im o.g. Rechnungsbetrag noch nicht enthalten. <br>
                  Mit deiner Lieferung erhältst du eine Rechnung für die gelieferten Produkte. Danach hast du 14 Tage Zeit, den Rechnungsbetrag zu überweisen. <br>
                  Versandkosten: {{ shippingCost }}€ <br>
                </p>
              </div>
            </div>
          </div>
        </transition>
      </div>
    </div>
    <div class="card mt-2 print-view d-print-no-border">
      <div class="card-body pt-1 pb-0">
        <div class="navbar navbar-expand pl-0 pr-0">
          <span class="navbar-brand">Teilnehmer  <span v-if="isCurrent">der aktuellen Bestelliste</span></span>
          <ul class="navbar-nav ml-auto d-print-none">
            <li class="nav-item">
              <a href="#" class="btn btn-sm float-right d-print-none" @click.prevent="showPrintList = !showPrintList" :class="{'btn-success': showPrintList, 'btn-light': !showPrintList}">
                <i class="mdi" :class="{'mdi-chevron-down': !showPrintList, 'mdi-chevron-up':  showPrintList}">&nbsp;</i>
                <span class="d-none d-sm-inline">{{ !showPrintList ? 'anzeigen' : 'verstecken'}}</span>
              </a>
            </li>
          </ul>
        </div>

        <transition name="info-box">
          <div :style="style.printList" class="print-list">
            <div class="print-list-container" ref="print-container">
              <hr>
              <div v-for="collector in filteredCollectors">
                <div class="table-responsive">
                  <table class="table table-bordered table-striped table-mobile" :class="{printing: printing}">
                    <thead class="thead-light">
                      <tr>
                        <td scope="col" v-html="highlight(collector.name)" colspan="7" class="font-weight-bold"></td>
                      </tr>
                      <tr>
                        <th scope="col">Artikel</th>
                        <th scope="col">Anzahl Boxen</th>
                        <th scope="col">Gesamtbetrag</th>
                        <th scope="col">davon Spende</th>
                        <th scope="col" class="d-none d-print-table-cell"><small>Boxen verteilt?</small></th>
                        <th scope="col" class="d-none d-print-table-cell"><small>Geld erhalten?</small></th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="(item, index) in collector.items" class="mb-0">
                        <td data-label="Name" class="font-weight-bold d-md-none d-print-none" v-if="index == 0" v-html="index == 0 ? highlight(collector.name) : ''"></td>
                        <td data-label="Artikel-Nr.">{{ item.number }}<span class="d-none d-md-inline"> – {{ item.name}}</span></td>
                        <td data-label="Anzahl">{{ item.quantity }}</td>
                        <td data-label="Gesamtbetrag">{{ (parseFloat(item.suggested_donation)+parseFloat(item.gross_price)) * item.quantity }}€</td>
                        <td data-label="davon Spende">{{ item.suggested_donation * item.quantity}}€</td>
                        <td class="d-none d-print-table-cell"></td>
                        <td class="d-none d-print-table-cell"></td>
                      </tr>
                      <tr>
                        <td class="font-weight-bold d-none d-md-table-cell d-print-table-cell">Summe:</td>
                        <td data-label="Summe Boxen">{{ getItemsQuantityByCollectorId(collector.id)}}</td>
                        <td data-label="Summe">{{ getPriceByCollectorId(collector.id) + getDonationsByCollectorId(collector.id)}}€</td>
                        <td data-label="davon Spenden">{{ getDonationsByCollectorId(collector.id) }}€</td>
                        <td class="d-none d-print-table-cell" colspan="2"></td>
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

  </div>
</template>
<script>
  export default {
    props: ['collectors', 'comment', 'isCurrent'],
    created() {
      if(this.isCurrent) {
        this.showPrintList = true
        this.showSummary = true
      }
    },
    data() {
      return {
        showPrintList: false,
        showSummary: false,
        search: '',
        value: '',
        sortBy: 'number',
        reverseSort: false,
        showSearch: false,
        uid: _.uniqueId(),
        showListsCache: {
          print: false,
          summary: false
        },
        style: {
          summary: {
            height: 0
          },
          printList: {
            height: 0
          }
        }
      }
    },
    computed: {
      printing() {
        return this.$store.state.action == 'PRINTING'
      },
      items() {
        var summarizedItems = []

        this.collectors.forEach(collector => {
          collector.items.forEach(item => {
            var itemExists = _.findIndex(summarizedItems, i => {
              return(i.number === item.number)
            })
            if(itemExists > -1) {
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
      allItemsPriceWithDonations() {
        return this.$store.getters.getAllItemsPriceWithDonations(this.collectors)
      },
      allItemsPrice() {
        return this.$store.getters.getAllItemsPrice(this.collectors)
      },
      allItemsDonations() {
        return this.$store.getters.getAllItemsDonations(this.collectors)
      },
      allItemsQuantity() {
        return this.getAllItemsQuantity()
      },
      sortedItems() {
        const sortedList = _.sortBy(this.items, (obj)=> {
          var sortTerm = obj[this.sortBy]
          if(this.sortBy == 'invoice') {
            sortTerm = parseInt(obj.quantity) * parseInt(obj.gross_price)
          } else if(this.sortBy == 'total') {
            sortTerm = this.getItemTotal(obj)
          } else if(this.sortBy == 'returns') {
            sortTerm = obj.suggested_donation*obj.quantity
          }
          return sortTerm
        })
        if(this.reverseSort) {
          return _.reverse(sortedList)
        }
        return sortedList
      },
      summarizedCollectors() {
        let collectors = _.cloneDeep(this.collectors)
        collectors.forEach(collector => {
          collector.items = this.$store.getters.getSummarizedItemsByCollectorId(collector.id)
        })
        return collectors
      },
      filteredCollectors() {
        var v = this.summarizedCollectors.filter((collector) => {
          return _.lowerCase(collector.name).match(_.lowerCase(this.search))
        });
        return v;
      },
      shippingCost() {
        var totalOrders = this.$store.getters.getAllItemsQuantity()
        if(totalOrders < 21 ) {
          return 4
        } else if(totalOrders < 100) {
          return 8
        } else if(totalOrders >= 100){
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
      getAllItemsPrice() {
        var sum = 0
        this.collectors.forEach(collector => {
          sum = sum + this.getTotalItemsPriceByCollectorId(collector.id)
        })
        return sum
      },
      getAllItemsPriceWithDonations() {
        var price = 0
        this.collectors.forEach(collector => {
          price = price + this.getTotalItemsPriceByCollectorId(collector.id) + this.getAllItemsDonationsByCollectorId(collector.id)
        })
        return price
      },
      getTotalItemsPriceByCollectorId(id) {
          var sum = 0;
          var collector = this.getCollectorById(id);
          _.each(collector.items, (item) => {
            sum = sum + item.quantity * item.gross_price;
          });
          return sum;
      },
      getAllItemsDonations() {
        var sum = 0
        this.collectors.forEach(collector => {
          sum = sum + this.getAllItemsDonationsByCollectorId(collector.id)
        })
        return sum
      },
      getSingleItemPrice(item) {
        return parseFloat(item.gross_price)+parseFloat(item.suggested_donation)
      },
      getPriceByCollectorId(id) {
        var sum = 0;
        var collector = this.getCollectorById(id);
        _.each(collector.items, (item) => {
          sum = sum + item.quantity * item.gross_price;
        });
        return sum;
      },
      getAllItemsDonationsByCollectorId(id) {
        var sum = 0;
        var collector = this.getCollectorById(id);
        _.each(collector.items, (item) => {
            sum += item.quantity * item.suggested_donation;
        });
        return sum;
      },
      getDonationsByCollectorId(id) {
        var sum = 0;
        var collector = this.getCollectorById(id);
        _.each(collector.items, (item) => {
            sum += item.quantity * item.suggested_donation;
        });
        return sum;
      },
      getItemsQuantityByCollectorId(id) {
        var counter = 0;
        var collector = this.getCollectorById(id);
        _.each(collector.items, (item) => {
          counter = counter + item.quantity;
        });
        return counter;
      },
      getAllItemsQuantity() {
        var totalOrders = 0;
        this.collectors.forEach(collector => {
          totalOrders += this.getItemsQuantityByCollectorId(collector.id)
        })
        return totalOrders
      },
      getCollectorById(id) {
        return this.collectors.find(collector => {
          return collector.id === id
        });
      },
      sortByNumber(items) {
        return _.sortBy(this.items, 'number')
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
      printing(printing) {
        if(printing) {
          $('body').addClass('printing')
        } else {
          $('body').removeClass('printing')
        }
      },
      showPrintList(newVal, oldVal) {
        if (newVal && this.$refs['print-container']) {
          this.style.printList.height = `${this.$refs['print-container'].clientHeight + 16}px`
        } else {
          this.style.printList.height = 0;
        }
      },
      showSummary(newVal, oldVal) {
        if (newVal && this.$refs['summary-container']) {
          this.style.summary.height = `${this.$refs['summary-container'].clientHeight + 16}px`
        } else {
          this.style.summary.height = 0;
        }
      }
    }
  }
</script>
