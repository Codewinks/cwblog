import Vue from 'vue'
import './plugins/vuetify'
import VueRouter from 'vue-router'

import App from './App.vue'
import AuthPlugin from './plugins/auth';
import router from './router';
import axios from 'axios';

Vue.use(VueRouter);
Vue.use(AuthPlugin);
Vue.config.productionTip = false;

Vue.prototype.$axios = axios;

new Vue({
  router,
  render: h => h(App),
  data() {
    return {
      isAuthenticated: false
    };
  },
  async created() {
    try {
      await this.$auth.renewTokens();
    } catch (e) {
      console.log(e);
    }
  },
  methods: {
    login() {
      this.$auth.login();
    },
    logout() {
      this.$auth.logOut();
    },
    handleLoginEvent(data) {
      console.log(data)
      this.isAuthenticated = data.loggedIn;
      this.profile = data.profile;
    }
  }
}).$mount('#app')
