import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../store/authStore'

const DASHBOARD_MAP = {
  'user': '/dashboard',
  'admin': '/admin-dashboard',
  'super_admin': '/admin-dashboard'
}

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: () => {
        const store = useAuthStore()
        // Use the sync property to avoid calling the API
        if (store.isAuthenticated) {
          const role = store.userData?.role
          return DASHBOARD_MAP[role] || '/dashboard'
        }
        return '/login'
      }
    },
    {
      path: '/login',
      component: () => import('@/views/loginVue.vue'),
      meta: { public: true, }

    },
    {
      path: '/register',
      component: () => import('@/views/registerVue.vue'),
      meta: { public: true, }

    },
    {
      path: '/forgot-password',
      component: () => import('@/views/forgotPassword.vue'),
      meta: { public: true }
    },
    {
      path: '/reset-password',
      component: () => import('@/views/reset-password.vue'),
      meta: { public: true }
    },
    {
      path: '/verify-email',
      component: () => import('@/components/emailVerification.vue'),
      meta: { public: true, }

    },
    {
      path: '/report',
      component: () => import('@/views/reportVue.vue'),
      meta: {
        requiresAuth: true,
        allowedRoles: ['user']
      }
    },
    {
      path: '/dashboard',
      component: () => import('@/views/dashboardVue.vue'),
      meta: {
        requiresAuth: true,
        allowedRoles: ['user']
      }

    },
    {
      path: '/admin-dashboard',
      component: () => import('@/views/adminDashboard.vue'),
      meta: {
        requiresAuth: true,
        allowedRoles: ['admin']
      }
    },
    {
      path: '/admin/reports',
      component: () => import('@/views/adminReportsView.vue'),
      meta: {
        requiresAuth: true,
        allowedRoles: ['admin']

      }

    },
    {
      path: '/admin/report/:id',
      component: () => import('@/views/adminDetailReport.vue'),
      meta: {
        requiresAuth: true,
        allowedRoles: ['admin']
      }
    },
    // super admin system analytics of the system
    {
      path: '/super-admin/system-analytics', // Added this
      component: () => import('@/components/auth/victim/superAdminSystemAnalytics.vue'),
      meta: {
        requiresAuth: true,
        allowedRoles: ['super_admin']
      }
    },
    // super admin, admin invitation view
    {
      path: '/super-admin/invite-system-admin',
      component: () => import('@/views/inviteAdmin.vue'),
      meta: {
        requiresAuth: true,
        // this will be removed but my account has currently no role of super_admin
        allowedRoles: ['super_admin']
      }
    },
    {
      path: '/verify-admin',
      component: () => import('@/components/adminDashboard/adminPortal.vue'),
      meta: {
        public: true,
      }
    },
    {
      path: '/user/report/:id',
      component: () => import('@/components/userDashboard/AffectedReportDetail.vue'),
      meta: {
        requiresAuth: true,
        allowedRoles: ['user']
      }
    },
    {
      path: '/admin/report/:id',
      component: () => import('@/components/userDashboard/reportVue.vue'),
      meta: {
        requiresAuth: true,
        allowedRoles: ['admin']

      }

    },
    {
      path: '/:pathMatch(.*)*',
      component: () => import('@/views/notFound.vue')
    }
  ],
})

router.beforeEach(async (to, from, next) => {
  const store = useAuthStore()

  const isGuestOnly = to.meta.public // Use the meta tag you already have
  const wasGuestOnly = from.meta.public

  if (isGuestOnly && wasGuestOnly) {
    return next()
  }

  let isAuth = store.isAuthenticated
  if (!isAuth && (to.meta.requiresAuth || isGuestOnly)) {
    isAuth = await store.userAuthStatus()
  }

  const role = store?.userData?.role
  const targetedDashboard = DASHBOARD_MAP[role] || '/dashboard'

  // 4. PROTECTION: Block authenticated users from Guest pages
  if (isAuth && isGuestOnly) {
    // FIX: Only redirect if we aren't already at the dashboard
    if (to.path !== targetedDashboard) {
      return next(targetedDashboard)
    }
  }

  // 5. PROTECTION: Redirect unauthenticated users to login
  if (!isAuth && to.meta.requiresAuth) {
    return next('/login')
  }

  // 6. ROLE PROTECTION: Prevent wrong roles from accessing routes
  if (isAuth && to.meta.allowedRoles) {
    if (!to.meta.allowedRoles.includes(role)) {
      // FIX: Only redirect if we aren't already at the correct dashboard
      if (to.path !== targetedDashboard) {
        return next(targetedDashboard)
      } else {
        // If they are already at their dashboard but the role doesn't match 
        // (e.g. a 'user' trying to hit '/admin-dashboard'), 
        // you might need a '403 Forbidden' or just let it fail.
        return next()
      }
    }
  }

  next()
})
/**
 * // router.beforeEach(async (to, from, next) => {
//   const store = useAuthStore()

//   // 1. Identify "Guest-Only" routes (Login/Register)
//   const isGuestOnly = to.path === '/login' || to.path === '/register' || to.path === '/verify-email' || to.path === '/forgot-password'
//   const wasGuestOnly = from.path === '/login' || from.path === '/register' || from.path === '/verify-email' || from.path === '/forgot-password'

//   // 2. SKIP async check if navigating BETWEEN Login and Register
//   if (isGuestOnly && wasGuestOnly) {
//     return next()
//   }

//   // 3. Conditional Auth Check
//   // We only call isAuth if going to a protected route OR entering login from outside
//   let isAuth = store.isAuthenticated // Check synchronous property first
//   if (!isAuth && (to.meta.requiresAuth || isGuestOnly)) {
//     isAuth = await store.userAuthStatus()
//   }

//   const role = store?.userData?.role

//   const targetedDashboard = DASHBOARD_MAP[role] || '/dashboard'

//   // 4. PROTECTION: Block authenticated users from Guest pages (Login/Register)
//   if (isAuth && isGuestOnly) {
//     return next(targetedDashboard)
//   }

//   // 5. PROTECTION: Redirect unauthenticated users to login
//   if (!isAuth && to.meta.requiresAuth) {
//     return next('/login')
//   }

//   // 6. ROLE PROTECTION: Prevent Admin from User routes (and User from Admin routes)
//   // This specifically solves why your Admin could hit '/dashboard'
//   if (isAuth && to.meta.allowedRoles) {
//     if (!to.meta.allowedRoles.includes(role)) {
//       // If the current route is for 'user' but current user is 'admin', 
//       // redirect them to their correct 'admin' dashboard.
//       return next(targetedDashboard)
//     }
//   }

//   next()
// })
 */
export default router