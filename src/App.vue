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
import { mapActions } from 'vuex';
import Home from './views/home';
export default {
  name: 'app',
  components: {
    Home,
  },
  methods: {
    ...mapActions([
      'userGetInfo',
    ]),
  },
  data() {
    return {
    };
  },
  async beforeMount() {
    const close = this.$loading();
    try {
      await this.userGetInfo();
    } catch (err) {
      this.$toast(err);
    } finally {
      close();
    }
  }
};
</script>

<style src="./app.sass" lang="sass"></style>
