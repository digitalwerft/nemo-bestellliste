import 'babel-polyfill';

import Home from './pages/home.vue'
import Campaign from './pages/campaign.vue'
import Summary from './pages/summary.vue'
import Login from './pages/login.vue'

import Auth from './services/auth'

const routes = [];

routes.push({
  component: Home,
  name: 'home',
  path: '/',
  meta: {auth: true}
})

routes.push({
  component: Campaign,
  name: 'campaign',
  path: '/campaign/:id',
  meta: {auth: true}
})

routes.push({
  component: Summary,
  name: 'summary',
  path: '/campaign/:id/zusammenfassung',
  meta: {auth: true}
})

routes.push({
  component: Login,
  name: 'login',
  path: '/login',
  beforeEnter: (to, from, next) => {
    let path = from.fullPath

    if (Auth.authenticated()) {
      // Redirect back to home to break the cycle
      if (from.name === 'login') {
        path = '/'
      }

      return next(path)
    }

    next()
  }
})

routes.guard = function(to, from, next) {
  const needsAuth = !!(to.meta && to.meta.auth)

  if (needsAuth && !Auth.authenticated()) {
    return next({name: 'login'})
  }

  next()
}

export default routes
