<template lang="pug">
//- 精选页面
mixin HotView
  .fullHeight.hotView(
    v-show="selected === 'hot'"
  )
    ul.hotList.fullHeightScroll
      li.bookViewWrapper(
        v-for="item in hotList"
        :key="item.no"
      )
        BookView(
          :style="{height: '110px'}"
          :book="item"
          @click.native="showDetail(item.no)"
        )
      intersection(
        :style="{height: '3px'}"
        v-on:intersection="loadMoreHotBooks"
      )

//- 书库页面
mixin BooksView
  .fullHeight.booksView(
    v-show="selected === 'books'"
  )
    ul.categoryList.fullHeightScroll
      li(
        v-for="(item, index) in categoryList"
        :key="item.name"
        :class="{active: selectedCategory === index}"
        @click="changeCategory(index)"
      ) {{item.name}}
    .books.fullHeightScroll
      p.tac(
        v-if="!categoryBooks.items || categoryBooks.items.length === 0"
      ) 正在加载中...
      ul(
        v-else
      )
        li.bookViewWrapper(
          v-for="item in categoryBooks.items"
          :key="item.no"
        )
          BookView(
            :style="{height: '110px'}"
            :book="item"
            @click.native="showDetail(item.no)"
          )
        intersection(
          :style="{height: '3px'}"
          v-on:intersection="loadMoreByCategory"
        )

//- 发现页面
mixin SearchView
  .fullHeight.searchView(
    v-show="selected === 'find'"
  )
    p.tac.searching(
      v-if="keyword && !searchBooks"
    ) 搜索中...
    mt-search.search(
      v-model="keyword"
    )
      mt-cell(
        v-for="item in searchBooks"
        :key="item.name"
        :title="item.name"
        :value="item.author"
        @click.native="showDetail(item.no)"
      )
      mt-cell.tac(
        v-if="searchBooks && searchBooks.length === 0"
        title="无符合条件的书籍"
      )

//- 书架页面
mixin ShelfView
  .fullHeightScroll(
    v-show="selected === 'shelf'"
  )
    loading(
      v-if="!favBooks"
    )
    p.tac(
      v-else-if="favBooks.length === 0"
    ) 您尚未收藏小说，请先添加
    .favBooks(
      v-else
    )
      mt-cell.favBook(
        v-for="item in favBooks"
        :key="item.no"
        @click.native="showDetail(item.no)"
      )
        template(
          slot="title"
        )
          .imageView
            image-view(
              :src="item.cover"
            )
          .contentView
            h3.font16
              .new.pullLeft(
                v-if="item.new"
              )
              | {{item.name}}
            p.ellipsis(
              v-if="item.latestChapter"
            ) 最新章节：{{item.latestChapter.title}}
            p.ellipsis(
              v-if="item.read"
            ) 上次阅读：{{item.read.title}}

.homePage
  mt-tabbar.tabBar(
    v-model="selected"
  )
    mt-tab-item.tabItem(
      v-for="item in items"
      :key="item.name"
      :id="item.id"
    )
      .iconfont(
        :class="item.cls"
      )
      | {{item.name}}

  +HotView
  +BooksView
  +SearchView
  +ShelfView
</template>

<script src="./home.js">
</script>
<style lang="sass" src="./home.sass" scoped></style>
