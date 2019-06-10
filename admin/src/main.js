import '@mdi/font/css/materialdesignicons.css'
import 'vuetify/src/stylus/app.styl'

import Vue from 'vue'
import Vuetify from 'vuetify'
import VueRouter from 'vue-router'

import App from './App.vue'
import AuthPlugin from './plugins/auth';
import router from './router';
import axios from 'axios';

Vue.use(VueRouter);
Vue.use(AuthPlugin);
Vue.use(Vuetify, {
  iconfont: 'mdi'
})

Vue.config.productionTip = false;

Vue.prototype.$axios = axios;

new Vue({
  router,
  render: h => h(App),
  data() {
    return {
      isAuthenticated: false,
      config:{
        siteUrl: 'http://localhost:8080/',
      }
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
      this.isAuthenticated = data.loggedIn;
      this.profile = data.profile;
      this.$axios.defaults.headers = {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + data.cwt
      }
    }
  }
}).$mount('#app')


Vue.filter('slugify', function (value) {
  value = value.replace(/^\s+|\s+$/g, ''); // trim
  value = value.toLowerCase();

  // remove accents, swap ñ for n, etc
  var from = "ãàáäâẽèéëêìíïîõòóöôùúüûñç·/_,:;";
  var to = "aaaaaeeeeeiiiiooooouuuunc------";
  for (var i = 0, l = from.length; i < l; i++) {
    value = value.replace(new RegExp(from.charAt(i), 'g'), to.charAt(i));
  }

  value = value.replace(/[^a-z0-9 -]/g, '') // remove invalid chars
    .replace(/\s+/g, '-') // collapse whitespace and replace by -
    .replace(/-+/g, '-'); // collapse dashes

  return value;
});