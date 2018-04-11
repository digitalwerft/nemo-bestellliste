<template>
  <div class="container-fluid">
    <section class="login row">
      <div class="col col-sm-12 offset-sm-3 col-md-10 offset-md-4 col-lg-8 offset-lg-5">
        <div class="container">
          <div class="alert alert-success" v-if="wasLoggedOut">
            Du wurdest erfolgreich abgemeldet!
          </div>
          <div class="alert alert-info" v-if="hasFailedAuth">
            Der eingegeben Login-Code ist ungültig!<br/>
            Bitte versuche es noch einmal.
          </div>
          <div class="card" ref="container">
            <div class="card-body">
              <h4 class="card-title">Login für Koordinatoren</h4>
              <p>Melde Dich mit Deinem <strong>Login-Code</strong> an, um eine neue Sitzung zu starten.</p>
              <form action="/login" method="POST" class="form-group">
                <button class="btn btn-primary btn-right" type="submit">Einloggen</button>
                <span class="form-bfc">
                  <input value="" class="form-control" type="text" name="auth-code" placeholder="Dein Login-Code">
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
    const $overlay = $('.loading-overlay');

    setTimeout(() => {
      $overlay.removeClass('loading')
    }, 500)
  },
  store,
  methods: {
    login() {
      const self = this
      const code  = encodeURIComponent(this.code)

      this.$store.dispatch('login', {code: code, self: self}).then(response => {
        this.$router.replace('/')
      }).catch(error => {
        alert("Anmeldung fehlgeschlagen!")
      })
    }
  },
  computed: {
    wasLoggedOut() {
      return this.$store.getters.wasLoggedOut
    },

    hasFailedAuth() {
      return this.$store.getters.hasFailedAuth
    }
  }
}
</script>
