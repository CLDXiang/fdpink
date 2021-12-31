import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import HomePage from '@/views/HomePage'
import ConfigPage from '@/views/ConfigPage'
import CoursePage from '@/views/CoursePage'
import LoginPage from '@/views/LoginPage'
import RegisterPage from '@/views/RegisterPage'
import SearchPage from '@/views/SearchPage'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'HomePage',
    component: HomePage,
  },
  {
    path: '/config',
    name: 'ConfigPage',
    component: ConfigPage,
  },
  {
    path: '/course/:id',
    name: 'CoursePage',
    component: CoursePage,
    props: (route) => ({ courseId: route.params.id }),
  },
  {
    path: '/login',
    name: 'LoginPage',
    component: LoginPage,
  },
  {
    path: '/register',
    name: 'RegisterPage',
    component: RegisterPage,
  },
  {
    path: '/search',
    name: 'SearchPage',
    component: SearchPage,
    props: (route) => ({ q: route.query.q }),
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

export default router
