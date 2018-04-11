import 'babel-polyfill'

export default {
  data(key) {
    const storage = window.localStorage.getItem('auth')
    const auth = storage && JSON.parse(storage)

    return auth && auth[key]
  },
  authenticated() {
    return this.data('isAuthenticated')
  },
  hasFailedAuth() {
    return this.data('hasFailedAuth')
  },
  apiToken() {
    return this.data('apiToken')
  },
  logout() {
    const storage = window.localStorage.removeItem('auth')
    return this.authenticated()
  },
  login() {
    window.localStorage.setItem('auth', JSON.stringify({isAuthenticated: true}))
  }
}
