import 'babel-polyfill'

export default {
  authenticated() {
    const storage = window.localStorage.getItem('auth')
    const auth = storage && JSON.parse(storage)

    return auth && auth.isAuthenticated
  },
  logout() {
    const storage = window.localStorage.removeItem('auth')
    return this.authenticated()
  },
  login() {
    window.localStorage.setItem('auth', JSON.stringify({isAuthenticated: true}))
  }
}
