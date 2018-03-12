<template>
  <div id="app">
    <MainTab />
  </div>
</template>

<script>

import MainTab from './components/MainTab';

export default {
  name: 'app',
  components: {
    MainTab,
  },
  data() {
    return {
      selected: '',
    };
  },
}
</script>

<style src="./app.sass" lang="sass"></style>
