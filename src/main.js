import Vue from 'vue'
import './style/app.scss'
import App from './App.vue'
import router from './router'
import Vuex from 'vuex'

Vue.config.productionTip = false
Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    auth: false,
    atlasItems: [],
  },
  mutations: {
    increment(state) {
      state.count++
    }
  }
})
new Vue({
  store: store,
  router,
  render: h => h(App)
}).$mount('#app')