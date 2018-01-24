<template>
  <section class="login row">
    <div class="col col-sm-12 offset-sm-3 col-md-10 offset-md-4 col-lg-8 offset-lg-5">
      <div class="container">
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
      const code = this.code
      const url  = '/api/login?auth-code=' + encodeURIComponent(code)

      this.$http.get(url)
        .then(response => {
          console.log("juhu")
          window.localStorage.setItem('auth', JSON.stringify({isAuthenticated: true}))
          self.$router.replace('/')
        }).catch(error => {
          console.log(error)
          alert("Anmeldung nicht erfolgreich")
        })
    }
  }
}
</script>
