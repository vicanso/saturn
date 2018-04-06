<template lang="pug">
#app
  Home.homePageWrapper
  transition
    router-view.childrenPageWrapper 
</template>

<script>
import {mapActions} from 'vuex';
import Home from './views/home';
export default {
  name: 'app',
  components: {
    Home,
  },
  methods: {
    ...mapActions(['userGetInfo', 'userGetSetting', 'userGetFavs']),
  },
  data() {
    return {};
  },
  async beforeMount() {
    const close = this.$loading();
    try {
      await this.userGetInfo();
      await this.userGetSetting();
      await this.userGetFavs();
    } catch (err) {
      this.$toast(err);
    } finally {
      close();
    }
  },
  beforeCreate() {
    // 禁止浏览器自带的滚动处理
    document.addEventListener('touchmove', e => {
      e.stopPropagation();
      e.stopImmediatePropagation();
    });
  },
};
</script>

<style src="./app.sass" lang="sass"></style>
