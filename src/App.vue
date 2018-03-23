<template>
  <div id="app">
    <Home
      class="homePageWrapper"
    />
    <transition>
      <router-view
        class="childrenPageWrapper"
      />
    </transition>
  </div>
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
    ...mapActions(['userGetInfo', 'userGetSetting']),
  },
  data() {
    return {};
  },
  async beforeMount() {
    const close = this.$loading();
    try {
      await this.userGetInfo();
      await this.userGetSetting();
    } catch (err) {
      this.$toast(err);
    } finally {
      close();
    }
  },
};
</script>

<style src="./app.sass" lang="sass"></style>
