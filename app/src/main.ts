import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import './index.css';
import { createI18n } from 'vue-i18n';

const messages = {
  zh: {
    home: '主页',
    courses: '课程',
    feedbacks: '评价',
    login: '登录',
  },
};

const i18n = createI18n({
  locale: 'zh',
  fallbackLocale: 'en',
  messages,
});

createApp(App).use(store).use(router).use(i18n).mount('#app');
