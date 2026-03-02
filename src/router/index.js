import { createRouter, createWebHistory } from 'vue-router'
import { supabase } from '@/lib/supabase'
import Home from '@/views/Home.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/admin/login',
      name: 'login',
      component: () => import('@/views/admin/Login.vue')
    },
    {
      path: '/admin/pos',
      name: 'pos',
      component: () => import('@/views/admin/POS.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/admin/products',
      name: 'products',
      component: () => import('@/views/admin/Products.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/admin/orders',
      name: 'orders',
      component: () => import('@/views/admin/Orders.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/admin/dashboard',
      name: 'dashboard',
      component: () => import('@/views/admin/Dashboard.vue'),
      meta: { requiresAuth: true }
    }
  ]
})

// Authentication Guard
router.beforeEach(async (to, from, next) => {
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth)
  
  if (requiresAuth) {
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) {
      next('/admin/login')
    } else {
      next()
    }
  } else {
    next()
  }
})

export default router
