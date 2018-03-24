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
    <!-- 精选 BEGIN -->
    <div
      v-show="selected === 'hot'"
      class="fullHeight hotView"
    >
      <ul
        class="hotList fullHeightScroll"
      >
        <li
          v-for="item in hotList"
          :key="item.no"
          class="bookViewWrapper"
        >
          <BookView
            :style="{
              height: '110px',
            }"
            :book="item"
            @click.native="showDetail(item.no)"
          ></BookView>
        </li>
        <intersection
          :style="{
            height: '3px',
          }"
          v-on:intersection="loadMoreHotBooks"
        >
        </intersection>
      </ul>
    </div>
    <!-- 精选 END -->

    <!-- 书库 BEGIN -->
    <div
      v-show="selected === 'books'"
      class="fullHeight booksView"
    >
      <ul
        class="categoryList fullHeightScroll"
      >
        <li
          v-for="(item, index) in categoryList"
          :key="item.name"
          :class="{
            active: selectedCategory === index, 
          }"
          @click="changeCategory(index)"
        >{{item.name}}</li>
      </ul>
      <div class="books fullHeightScroll">
        <p v-if="!categoryBooks.items || categoryBooks.items.length === 0" class="tac">正在加载中...</p>
        <ul v-else>
          <li
            v-for="item in categoryBooks.items"
            :key="item.no"
            class="bookViewWrapper"
          >
            <BookView
              :style="{
                height: '110px',
              }"
              :book="item"
              @click.native="showDetail(item.no)"
            ></BookView>
          </li>
          <intersection
            :style="{
              height: '3px',
            }"
            v-on:intersection="loadMoreByCategory"
          >
          </intersection>
        </ul>
      </div>
    </div>
    <!-- 书库 END -->

    <!-- 发现 BEGIN -->
    <div
      v-show="selected === 'find'"
      class="fullHeight"
    >
      <mt-search
        v-model="keyword"
        :style="{
          height: '100%',
          position: 'relative',
        }"
      >
        <mt-cell
          v-for="item in searchBooks"
          :key="item.name"
          :title="item.name"
          :value="item.author"
          @click.native="showDetail(item.no)"
        ></mt-cell>
        <mt-cell
          v-if="searchBooks && searchBooks.length === 0"
          class="tac"
          title="无符合条件的书籍"
        ></mt-cell>
      </mt-search>
    </div>
    <!-- 发现 END -->
  </div>
</template>

<script src="./home.js">
</script>
<style lang="sass" src="./home.sass" scoped></style>
