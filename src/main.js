import { createApp } from 'vue'
import App from './App.vue'
import router from './router';
import 'element-plus/es/components/message/style/css'

const app = createApp(App)
app.use(router);
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token');
  if (to.matched.some((record) => record.meta.requiresAuth) && !token) {
    next('/login');
  } else {
    next();
  }
});

app.mount('#app')