import 'babel-polyfill'

export default {
  authenticated() {
    const storage = window.localStorage.getItem('auth')
    const auth = storage && JSON.parse(storage)

    return auth && auth.isAuthenticated
  }
}
