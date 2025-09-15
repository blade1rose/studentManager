import { createRouter, createWebHistory } from 'vue-router'
import Login from '../views/Login.vue'
import Register from '../views/Register.vue'
import Score from '../views/Score.vue'

const isAuthenticated = () => {
  return sessionStorage.getItem('isAuthenticated') === 'true'
}

const routes = [
  { 
    path: '/',
    redirect: () => {
      return isAuthenticated() ? '/score' : '/login'
    }
  },
  { path: '/login', component: Login },
  { path: '/register', component: Register },
  { 
    path: '/score', 
    name: 'score', 
    component: Score,
    meta: { requiresAuth: true } 
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  // 添加对登录页的特殊处理
  if (to.path === '/login' && isAuthenticated()) {
    next('/score')
    return
  }

  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (!isAuthenticated()) {
      next({
        path: '/login',
        query: { redirect: to.fullPath }
      })
    } else {
      next()
    }
  } else {
    next()
  }
})

export default router