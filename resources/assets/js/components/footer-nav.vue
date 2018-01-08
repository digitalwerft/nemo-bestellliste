<template>
  <div class="container sticky-container ">
    <nav class="navbar navbar-expand-md navbar-light bg-white fixed-bottom footer-bar">
            <router-link :to="{name: 'summary'}" class="d-block d-md-none btn btn-success btn-block btn-lg">Zusammenfassung
          </router-link>
      <div class="collapse navbar-collapse" id="navbarSupportedContent">
        <ul class="navbar-nav">
          <li class="nav-item">
            <i class="mdi mdi-account">&nbsp;</i>Teilnehmer: {{ buyers.length }}&nbsp;|&nbsp;
          </li>
          <li class="nav-item">
            <i class="mdi mdi-library-books">&nbsp;</i>Bestellte Boxen: {{ totalOrders }}&nbsp;|&nbsp;
          </li>
          <li class="nav-item">
            <i class="mdi mdi-currency-eur">&nbsp;</i>Rechnungsbetrag: {{ winnings }}€&nbsp;|&nbsp;
          </li>
          <li class="nav-item">
            <i class="mdi mdi-currency-eur">&nbsp;</i>Spendensumme: {{ earnings }}€
          </li>
        </ul>
        <ul class="navbar-nav ml-auto">
          <li class="nav-item">
            <router-link :to="{name: 'summary'}" class="btn btn-outline-danger my-2 my-sm-0 order-now">Zusammenfassung
              <i class="mdi mdi-chevron-right"></i>
            </router-link>
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

    },
    computed: {
      buyers() {
        return this.$store.state.buyers.all;
      },
      totalBuyers() {
        return this.buyers.length;
      },
      totalOrders() {
        return this.$store.getters.getTotalOrdersAmount;
      },
      winnings() {
        return this.$store.getters.getTotalOrdersWinnings
      },
      earnings() {
        return this.$store.getters.getTotalOrdersEarnings
      }
    }
}
</script>
