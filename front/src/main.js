// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import axios from 'axios'
// import VueSession from 'vue-session'
import Vuetify from 'vuetify'

// index.js or main.js
import 'vuetify/dist/vuetify.min.css' // Ensure you are using css-loader

// main.styl
// @import '~vuetify/src/stylus/main' // Ensure you are using stylus-loader

Vue.config.productionTip = false
Vue.prototype.$http = axios


// Vue.use(VueSession)
Vue.use(Vuetify)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})

