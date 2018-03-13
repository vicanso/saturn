<template>
  <div class="homePage">
    <mt-tabbar
      v-model="selected"
      class="tabbar"
    >
      <mt-tab-item
        v-for="item in items"
        :key="item.name"
        :id="item.id"
      >
        <img slot="icon" />
        {{ item.name }}
      </mt-tab-item>
    </mt-tabbar>
  </div>
</template>

<script src="./home.js"></script>
<style lang="sass" src="./home.sass" scoped></style>
