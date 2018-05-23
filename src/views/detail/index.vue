<template lang="pug">
mixin HeaderBackBtn
  v-touch.headerBack(
    tag="a"
    slot="left"
    v-on:tap="back"
  )
    i.mintui.mintui-back

//- 功能页
mixin FunctionView
  .functionView(
    v-show="mode === 0"
    :style=`{
      height: (deviceInfo.mainNav + deviceInfo.paddingBottom) + 'px',
    }`
  )
    v-touch(
      tag="a"
      href="javascript:;"
      v-on:tap="download"
    )
      i.iconfont.icon-icondownload
      span 下载
    v-touch.read(
      tag="a"
      href="javascript:;"
      v-on:tap="goOnReading()"
    )
      i.iconfont.icon-office
      span(v-if="currentReadInfo") 免费阅读
      span(v-else) 继续阅读
    v-touch(
      tag="a"
      href="javascript:;"
      v-on:tap="userFavsToggle($route.params.no)"
      :class=`{
        favAdded,
      }`
    )
      i.iconfont.icon-pin
      span(v-if="favAdded") 已在书架
      span(v-else) 加入书架

//- 书籍详情
mixin DetailView
  .bookView.fullHeight(
    v-show="mode === 0"
    :style=`{
      paddingBottom: (deviceInfo.mainNav + deviceInfo.paddingBottom) + 'px',
    }`
  ): .fullHeightScroll
    .mbottom10(
      v-if="book"
    )
      .clearfix.infoView(
        :style="{padding: '15px', height: '160px'}"
      )
        image-view.imageView(
          :src="book.cover"
        )
        .contentView
          h4 {{book.name}}
          p.info.font14 {{book.category[0]}} | {{book.author}}
          p.wordCount.font14 {{Math.ceil(book.wordCount / 10000) + '万字'}}
            span(
              v-if="book.end"
            ) 完本
          p.font12(
            v-if="book.latestChapter"
          ) 最新章节：{{book.latestChapter.title}}
      .briefView.font14 {{book.brief}}
      v-touch(
        v-on:tap="mode = 1"
      )
        .latestChapter 查看目录
          i.pullRight.mintui.mintui-back.rotate180.font14
          span.pullRight.font12(
            v-if="updatedAt"
          ) 更新于{{updatedAt}}
          span.font12(
            v-if="book.latestChapter"
          ) 连载至{{book.latestChapter.no + 1}}章
      .recommendations
        h3 热门推荐
        ul(
          v-if='recommendations'
        )
          li(
            v-for='item in recommendations'
            :key='item.no'
          )
            v-touch(
              v-on:tap="showDetail(item.no)"
            )
              .imageView: image-view(
                :src="item.cover"
              )
              h5.ellipsis {{item.name}}
              h6.ellipsis {{item.author}}
        p.tac(
          v-else
        ) 加载中...
        

//- 章节列表
mixin ChapterView
  .chaptersView.fullHeight(
    v-show="mode === 1"
  )
    loading(
      v-if="!chaptersInfo"
    )
    .fullHeightScroll(
      v-else
    )
      div(
        v-for="(title, index) in chaptersInfo.titles"
        :key="title"
      )
        mt-cell.chapterGroup(
          :title="title"
          :class="{active: index === chaptersInfo.current,even: index % 2 === 0}"
          @click.native="changeChapterGroup(index)"
        )
          i.mintui.mintui-back.pullRight
        div(
          v-if="index === chaptersInfo.current"
        )
          mt-cell.chapter(
            v-for="item in chaptersInfo.subItems"
            :key="item.no"
            :title="item.title"
            @click.native="read(item.no)"
          )

//- 章节内容页
mixin ContentView
  .fullHeight(
    v-show="mode === 2"
  )
    mt-header.settingHeader(
      title=""
      fixed
      v-if="isShowingSetting"
      :style=`{
        paddingTop: deviceInfo.paddingTop + 'px',
      }`
    )
      +HeaderBackBtn
      mt-button.mright20(
        slot="right"
        @click.native="toggleNightTheme"
      )
        i.iconfont.icon-light.mright5
        | 夜间
      mt-button.mright20(
        slot="right"
        @click.native="mode = 1"
      )
        i.iconfont.icon-category.mright5
        | 章节
    .settingFooter(
      v-if="isShowingSetting"
    )
      .fontSize
        span(
          @click="changeFontSize(-1)"
        ) T-
        span {{userSetting.fontSize}}
        span(
          @click="changeFontSize(1)"
        ) T+
      .theme
        div(
          v-for="theme in themes"
          :key="theme.name"
          @click="changeTheme(theme.name)"
        )
          span(
            :style="{backgroundColor: theme.backgroundColor}"
          )
            i.iconfont.icon-selected(
              :class="{active: theme.name === userSetting.theme}"
            )
    .fullHeight(
      ref="chapterContent"
    )
    .centerFixed.showReload(
      v-if="showReload"
    )
      mt-button(
        type="primary"
        size="large"
        @click.native="changeChapter(1)"
      ) 重新加载

.fullHeight
  mt-header.font18.mainHeader(
    :title="title"
    fixed
    v-show="mode !== 2"
    :style=`{
      paddingTop: deviceInfo.paddingTop + 'px',
    }`
  )
    +HeaderBackBtn
  +FunctionView
  .fullHeight(
    v-show="mode != 2"
    :style=`{
      paddingTop: deviceInfo.paddingTop + 'px',
    }`
  )
    +DetailView
    +ChapterView
  +ContentView

</template>

<script src="./detail.js">
</script>
<style lang="sass" src="./detail.sass" scoped></style>
