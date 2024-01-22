import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/',
      name: 'home',
      redirect: '/maps',
      component: DashboardLayout,
      children: [
        {
          path: 'maps',
          name: 'maps',
          components: { default: Starter }
        }
      ]
    }
  ]
});
