<template>
  <div class="container">
    <div class="card">
      <div class="card-body">
        <router-link :to="{ name: 'home'}" class="btn btn-outline-primary float-right"><i class="mdi mdi-lead-pencil">&nbsp;</i>Bestellung bearbeiten</router-link>
        <router-link :to="{ name: 'print'}" class="btn btn-outline-primary float-right mr-2"><i class="mdi mdi-printer">&nbsp;</i>Druckansicht</router-link>
        <h4 class="card-title">
          Zusammenfassung</h4>
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
              <td colspan="2">{{ totalOrdersAmount }}</td>
              <td>{{ allArticlesSum }}€</td>
              <td>{{ allArticlesEarnings }}</td>
            </tr>
          </tbody>
        </table>
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
  export default {
    store,
    data() {
      return {}
    },
    computed: {
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
    }
  }
</script>
