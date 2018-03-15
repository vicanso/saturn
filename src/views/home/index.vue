<template>
  <div class="homePage">
    <mt-tabbar
      v-model="selected"
      class="tabBar"
    >
      <mt-tab-item
        v-for="item in items"
        :key="item.name"
        :id="item.id"
        class="tabItem"
      >
        <div
          :class="item.cls + ' iconfont'"
        ></div>
        {{ item.name }}
      </mt-tab-item>
    </mt-tabbar>
    <div
      v-show="selected === 'hot'"
      class="fullHeight"
    >
      <ul
        class="hotList fullHeightScroll"
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
            <h3 class="font16">{{item.name}}</h3>
            <p class="font14">{{item.brief}}</p>
            <div
              class="pullRight"
            >
              <span
                class="category"
                v-if="item.category && item.category[0]"
              >{{item.category[0]}}</span>
              <span class="category"> {{Math.ceil(item.wordCount / 10000) + '万字'}}</span>
            </div>
            <div
              class="font14 ellipsis author"
            >{{item.author}}</div>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script src="./home.js">
</script>
<style lang="sass" src="./home.sass" scoped></style>
