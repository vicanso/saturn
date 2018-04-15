<template lang="pug">
#app
  Home.homePageWrapper
  transition(
    name="bounce-right-fade"
  )
    router-view.childrenPageWrapper 
</template>

<script>
import {mapActions} from 'vuex';
import Home from './views/home';
import cordova from './helpers/cordova';
export default {
  name: 'app',
  components: {
    Home,
  },
  methods: {
    ...mapActions([
      'userGetInfo',
      'userGetSetting',
      'userGetFavs',
      'basicDeviceInfo',
    ]),
  },
  data() {
    return {};
  },
  async beforeMount() {
    try {
      await cordova.waitForReady();
      await this.basicDeviceInfo();
      await this.userGetSetting();
      await this.userGetInfo();
      await this.userGetFavs();
    } catch (err) {
      this.$toast(err);
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
