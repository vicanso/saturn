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
    <div
      v-show="selected === 'hot'"
    >
      <ul
        class="hotList"
        v-if="hotList"
      >
        <li
          v-for="item in hotList"
          :key="item.no"
          class="bookView"
        >
          <div class="imageView">
            <image-view
              :src="item.cover"
            />
          </div>
          <div class="contentView">
            <h5>{{item.name}}</h5>
            <p>{{item.brief}}</p>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script src="./home.js">
</script>
<style lang="sass" src="./home.sass" scoped></style>
