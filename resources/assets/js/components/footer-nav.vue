<template>
  <div class="container sticky-container d-none d-md-block">
    <nav class="navbar navbar-expand-md navbar-light bg-white fixed-bottom footer-bar">
            <router-link :to="{name: 'summary'}" class="d-block d-md-none btn btn-success btn-block btn-lg">Zusammenfassung
          </router-link>
      <div class="collapse navbar-collapse" id="navbarSupportedContent">
        <ul class="navbar-nav">
          <li class="nav-item">
            <i class="mdi mdi-account">&nbsp;</i>Teilnehmer: {{ collectors.length }}&nbsp;|&nbsp;
          </li>
          <li class="nav-item">
            <i class="mdi mdi-library-books">&nbsp;</i>Bestellte Boxen: {{ totalOrders }}&nbsp;|&nbsp;
          </li>
          <li class="nav-item">
            Rechnungsbetrag {{ price }}€ + Spende {{ earnings }}€ = Gesamtbetrag {{ winnings }}€
          </li>
        </ul>
      </div>
    </nav>
  </div>
</template>

<script>
export default {
    mounted() {
        //
    },
    data() {
        return {}
    },
    methods: {
      formatNumber(number) {
        return String(number).replace(/(.)(?=(\d{3})+$)/g,'$1.')
      }
    },
    computed: {
      collectors() {
        return this.$store.state.collectors.all
      },
      totalCollectors() {
        return this.collectors.length
      },
      totalOrders() {
        return this.$store.getters.getAllItemsQuantity()
      },
      winnings() {
        return this.formatNumber(this.$store.getters.getAllItemsPriceWithDonations())
      },
      earnings() {
        return this.formatNumber(this.$store.getters.getAllItemsDonations())
      },
      price() {
        return this.formatNumber(this.$store.getters.getAllItemsPrice())
      }
    }
}
</script>
