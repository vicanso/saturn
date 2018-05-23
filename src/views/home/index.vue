<template lang="pug">
//- 用户设置页面
mixin UserSettingView
  .fullHeight.hotView(
    v-if="selected === 'userSetting' && userSetting && deviceInfo"
  )
    mt-cell(
      :title="(bookCacheSize || '--') + 'MB'"
      value="缓存数据"
    )
    mt-cell(
      :title="userSetting.version"
      value="软件版本"
    )
    mt-cell(
      :title="deviceInfo.version" 
      value="系统版本"
    )
    mt-cell(
      :title="userInfo && userInfo.track" 
      value="设备标识"
    )
    mt-cell(
      :title="deviceInfo.serial"
      value="序列号"
    )
    mt-cell(
      :title="deviceInfo.uuid"
      value="uuid"
    )
    v-touch(
      v-on:tap="clearCache"
    )
      mt-button.mtop10(
        type="primary"
        :style=`{
          width: '100%',
        }`
      ) 清除缓存

//- 精选页面
mixin HotView
  .fullHeight.hotView(
    v-show="selected === 'hot'"
  )
    loading(
      v-if="!hotList.length"
    )
    ul.hotList.fullHeightScroll(
      ref="hotList"
    )
      li.bookViewWrapper(
        v-for="item in hotList"
        :key="item.no"
      )
        v-touch(
          v-on:tap="showDetail(item.no)"
        )
          BookView(
            :style="{height: '110px'}"
            :book="item"
          )
      intersection(
        v-if="!loadHotBooksDone && hotList.length !== 0"
        :style="{padding: '5px'}"
        v-on:intersection="loadMoreHotBooks"
      )
        .tac.font12(slot="content") 正在加载中...

//- 书库页面
mixin BooksView
  .fullHeight.booksView(
    v-show="selected === 'books'"
  )
    ul.categoryList.fullHeightScroll
      v-touch(
        tag="li"
        v-for="(item, index) in categoryList"
        :key="item.name"
        :class="{active: selectedCategory === index}"
        v-on:tap="changeCategory(index)"
      ) {{item.name}}
    .books.fullHeightScroll(
      ref="categoryBookList"
    )
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
          v-touch(
            v-on:tap="showDetail(item.no)"
          )
            BookView(
              :style="{height: '110px'}"
              :book="item"
            )
        intersection(
          v-if="!categoryBooks.done"
          :style="{padding: '5px'}"
          v-on:intersection="loadMoreByCategory"
        )
          .tac.font12(slot="content") 正在加载中...

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
      div(
        v-if="searchBooks && searchBooks.length === 0"
      )
        mt-cell.tac(
          title="无符合条件的书籍"
        )
        h3.font12 如建议添加书籍请填写
        mt-field(
          label="作者"
          placeholder="请输入作者"
          v-model="requestBook.author"
        )
        mt-field(
          label="书名"
          placeholder="请输入书名"
          v-model="requestBook.name"
        )
        mt-button(
          :style=`{
            marginTop: '20px',
            width: '100%',
          }`
          @click.native="requestAdd"
          type="primary"
        ) 建议添加


//- 书架页面
mixin ShelfView
  .fullHeightScroll(
    ref="shelfList"
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
      ref="favBooks"
    )
      .tac.font12.loadingFavs(
        v-if="isLoadingFavs"
        :style=`{
          top: (deviceInfo.mainNav + deviceInfo.paddingTop) + 'px',
        }`
      ) 正在刷新中...

      v-touch(
        v-for="item in favBooks"
        :key="item.no"
        v-on:tap="showDetail(item.no, $event)"
      )
        .favBook.clearfix
          a.remove(
            href="javascript:;"
            v-if="showUnfav"
          ) 移 除 
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

mixin MainNav
  .mainNav.contentBox(
    :style=`{
      height: (deviceInfo.mainNav + deviceInfo.paddingBottom) + 'px',
    }`
  )
    v-touch.contentBox(
      tag="a"
      href="javascript:;"
      v-for="item in items"
      :key="item.name"
      :class="selected === item.id ? 'active' : ''"
      v-on:tap="selected = item.id"
      :style=`{
        paddingBottom: deviceInfo.paddingBottom + 'px',
      }`
    )
      .iconfont(
        :class="item.cls"
      )
      | {{item.name}}

.homePage(
  :style=`{
    paddingTop: (deviceInfo.mainNav + deviceInfo.paddingTop) + 'px',
    paddingBottom: (deviceInfo.mainNav + deviceInfo.paddingBottom + 1) + 'px',
  }`
)
  mt-header.font18.mainHeader(
    title="闲 书"
    v-if="deviceInfo.platform"
    fixed
    :style=`{
      paddingTop: deviceInfo.paddingTop + 'px',
    }`
  )
    v-touch.bold.userSetting(
      tag="a"
      slot="right"
      v-on:tap="showSetting()"
    )
      i.iconfont.icon-set
  +MainNav
  +HotView
  +BooksView
  +SearchView
  +ShelfView
  +UserSettingView
</template>

<script src="./home.js">
</script>
<style lang="sass" src="./home.sass" scoped></style>
