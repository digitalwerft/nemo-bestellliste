<template>
  <div class="container">
    <div class="card">
      <div class="card-body">
        <router-link :to="{ name: 'home'}" class="btn btn-outline-primary float-right"><i class="mdi mdi-lead-pencil">&nbsp;</i>Bestellung bearbeiten</router-link>
        <router-link :to="{name: 'summary'}" class="btn btn-outline-primary float-right mr-2">
          <i class="mdi mdi-grid">&nbsp;</i>
          Zusammenfassung
        </router-link>
        <h4 class="card-title">Druckansicht der Bestellung #{{ user.orderNr}}</h4>
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
  </div>
</template>
<script>
  import store from '../store'
  export default {
    store,
    computed: {
      user() {
        return this.$store.getters.getUser
      },
      buyers() {
        return this.$store.getters.getAllBuyers;
      }
    },
    methods: {
      getArticleById(id) {
        return this.$store.getters.getArticleById(id)
      },
      getPriceByBuyerId(id) {
        return this.$store.getters.getTotalOrdersPriceByBuyerId(id)
      }
    }
  }
</script>
