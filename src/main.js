import 'intersection-observer';
import Vue from 'vue';
import _ from 'lodash';
import Mint from 'mint-ui';
import VuexRouterSync from 'vuex-router-sync';
import 'mint-ui/lib/style.css';
import localforage from 'localforage';
import VueTouch from 'vue-touch';

import './assets/iconfont/iconfont.css';
import App from './App.vue';
import router from './router';
import store from './store';
import './request-interceptors';
import {getErrorMessage} from './helpers/util';
import {env} from './config';

Vue.use(VueTouch, {name: 'v-touch'});
Vue.use(Mint);
VuexRouterSync.sync(store, router);

if (!Number.parseInt) {
  Number.parseInt = window.parseInt;
}

// 注入 router 和 store
Vue.$router = router;
Vue.$store = store;

Vue.config.productionTip = env === 'production';

Vue.prototype.$toast = (data, ms = 3000) => {
  let message = getErrorMessage(data);
  Mint.Toast({
    message,
    duration: ms,
  });
  if (env === 'development' && _.isError(data)) {
    throw data;
  }
};

Vue.prototype.$loading = (timeout = 10000) => {
  const Indicator = Mint.Indicator;
  // 延迟显示loading（有些处理很快就响应，不展示loading）
  const delayTimer = setTimeout(() => {
    Indicator.open({
      text: '加载中...',
      spinnerType: 'fading-circle',
    });
  }, 50);
  let resolved = false;
  const resolve = () => {
    if (resolved) {
      return;
    }
    clearTimeout(delayTimer);
    resolved = true;
    Indicator.close();
  };
  setTimeout(resolve, timeout);
  return resolve;
};

Vue.prototype.$next = function nextTickPromise() {
  return new Promise(resolve => this.$nextTick(resolve));
};

localforage.config({
  name: 'saturn',
  version: 1.0,
  storeName: 'novel',
  description: 'novel database',
});

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app');
