import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../store/authStore'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      component: () => import('@/views/loginVue.vue')
    },
    {
      path: '/register',
      component: () => import('@/views/registerVue.vue')
    },
    {
      path: '/report',
      component: () => import('@/views/reportVue.vue')
    },
    {
      path: '/dashboard',
      component: () => import('@/views/dashboardVue.vue')
    },
    {
      // we need to change it after we create the not found component
      path: '/:pathMatch(.*)*',
      component: () => import('@/views/loginVue.vue')
    }
  ],
})


const authRoutes = ['/register', '/login', '/']
const user_post_auth_routes = ['/dashboard', '/report']
router.beforeEach(async (to, from, next) => {
  const store = useAuthStore()
  let isAuth = await store.userAuthStatus()

  // user is authenticated now now prevent him from going back to authroutes
  if (isAuth && authRoutes.includes(to.path)) {
    return next('/dashboard')
  }
  // now prevent the user from dashboard if not authenticated
  if (!isAuth && user_post_auth_routes.includes(to.path)) {
    return next('/login')
  }
  next()
})

export default router
