import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';
import HomePage from '@/views/HomePage';
import ConfigPage from '@/views/ConfigPage';
import CoursePage from '@/views/CoursePage';
import LoginPage from '@/views/LoginPage';
import RegisterPage from '@/views/RegisterPage';
import SearchPage from '@/views/SearchPage';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'HomePage',
    component: HomePage,
  },
  {
    path: '/config',
    name: 'ConfigPage',
    components: ConfigPage,
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
  // {
  //   path: '/about',
  //   name: 'About',
  //   // route level code-splitting
  //   // this generates a separate chunk (about.[hash].js) for this route
  //   // which is lazy-loaded when the route is visited.
  //   component: () => import(/* webpackChunkName: "about" */ '../views/About.vue'),
  // },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
