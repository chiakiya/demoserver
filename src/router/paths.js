/**
 * Define all of your application routes here
 * for more information on routes, see the
 * official documentation https://router.vuejs.org/en/
 */

export default [
  {
    path: '*',
    meta: {
      name: '',
      requiresAuth: false
    },
    redirect: {
      path: '/'
    }
  },
  // This  allows you to have pages apart of the app but no rendered inside the dash
  {
    path: '/',
    meta: {
      name: '',
      requiresAuth: false
    },
    component: () => import(`@/views/HomeView.vue`)
  }
]
