<template>
  <div class="container-fluid">
    <section class="login row">
      <div class="col col-sm-12 offset-sm-3 col-md-10 offset-md-4 col-lg-8 offset-lg-5">
        <div class="container">
          <div class="alert alert-success" v-if="wasLoggedOut">
            Du wurdest erfolgreich abgemeldet!
          </div>
          <div class="card" ref="container">
            <div class="card-body">
              <h4 class="card-title">Login für Kontaktpersonen</h4>
              <p>Melde Dich mit Deinem <strong>Login-Code</strong> an, um eine neue Sitzung zu starten.</p>
              <form class="form-group" @submit.prevent="login({code})">
                <button class="btn btn-primary btn-right" type="submit">Einloggen</button>
                <span class="form-bfc">
                  <input class="form-control" type="text" v-model="code" placeholder="Dein Login-Code">
                </span>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>
<script>
import store from '../store'

export default {
  data() {
    return {
      code: null
    }
  },
  created() {
    setTimeout(() => {
      $('.loading-overlay').removeClass('loading')
      setTimeout(() => {
        $('.loading-overlay').addClass('hidden')
      }, 1000)
    }, 600)
  },
  store,
  methods: {
    login() {
      const self = this
      const code  = encodeURIComponent(this.code)

      this.$store.dispatch('login', {code: code, self: self}).then(response => {
        console.log('Anmeldung erfolgreich!')
        this.$router.replace('/')
      }).catch(error => {
        alert("Anmeldung fehlgeschlagen!")
      })
    }
  },
  computed: {
    wasLoggedOut() {
      return this.$store.getters.wasLoggedOut
    }
  }
}
</script>
