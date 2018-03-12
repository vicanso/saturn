import Vue from 'vue';
import Mint from 'mint-ui';
import 'mint-ui/lib/style.css';

import App from './App.vue';

Vue.use(Mint);

Vue.config.productionTip = false;

new Vue({
  render: h => h(App),
}).$mount('#app');
