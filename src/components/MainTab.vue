<template>
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
</template>

<script>
export default {
  data() {
    return {
      selected: null,
      items: [
        {
          id: 'shelf',
          name: '书架',
        },
        {
          id: 'hot',
          name: '精选',
        },
        {
          id: 'books',
          name: '书库',
        },
        {
          id: 'find',
          name: '发现',
        },
      ],
    };
  },
};
</script>

<style lang="sass" scoped>
@import "../variables"
.tabbar
  background-color: #fff
  border-top: $GRAY_BORDER
  color: $COLOR_DARK_GRAY
</style>
