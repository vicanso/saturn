<template>
  <div class="fullHeight">
    <mt-header
      class="mainHeader"
      :title="title"
      fixed
      v-show="mode !== 2"
    >
      <mt-button
        icon="back"
        slot="left"
        @click="back"
      ></mt-button>
    </mt-header>
    <div
      class="functionView"
      v-show="mode === 0"
    >
      <a
        href="javascript:;"
      >下载</a>
      <a
        href="javascript:;"
        class="read"
        @click="changeChapter(0)"
      >
        <span v-if="!currentReadInfo">免费阅读</span>
        <span v-else>继续阅读</span>
      </a>
      <a
        href="javascript:;"
      >加入书架</a>
    </div>
    <!-- 书籍详情 BEGIN -->
    <div
      v-show="mode === 0"
      class="bookView fullHeight"
    ><div class="fullHeightScroll">
      <div
        class="infoView"
        v-if="book"
      >
        <div
          class="clearfix"
          :style="{
            padding: '15px',
            height: '160px',
          }"
        >
          <image-view
            class="imageView"
            :src="book.cover"
          />
          <div
            class="contentView"
          >
            <h4>{{book.name}}</h4>
            <p
              class="info font14"
            >{{book.category[0]}} | {{book.author}}</p>
            <p
              class="wordCount font14"
            >{{Math.ceil(book.wordCount / 10000) + '万字'}}
              <span v-if="book.end">完本</span>
            </p>
          </div>
        </div>
        <p class="briefView font14">{{book.brief}}</p>
        <div
          class="latestChapter"
          @click="mode = 1"
        >查看目录
          <i class="pullRight mintui mintui-back rotate180 font14"></i>
          <span
            v-if="updatedAt"
            class="pullRight font12"
          >更新于{{updatedAt}}</span>
          <span
            v-if="book.latestChapter"
            class="font12"
          >连载至{{book.latestChapter.no + 1}}章</span>
        </div>
      </div>
    </div></div>
    <!-- 书籍详情 END -->

    <!-- 书籍章节列表 BEGIN -->
    <div
      v-show="mode === 1"
      class="chaptersView fullHeight"
    >
      <loading
        v-if="!chapters"
      />
      <div
        v-else
        class="fullHeightScroll"
      >
        <mt-cell
          class="chapter"
          v-for="(item, index) in chapters"
          :key="index"
          :title="item.title"
          @click.native="read(index)"
        ></mt-cell>
      </div>
    </div>
    <!-- 书籍章节列表 END -->

    <div
      v-show="mode === 2"
      class="fullHeight"
    >
      <!-- 顶部功能设置 BEGIN -->
      <mt-header
        title=""
        fixed
        class="settingHeader"
        v-if="isShowingSetting"
      >
        <mt-button
          icon="back"
          slot="left"
          @click="back"
        ></mt-button>
        <mt-button
          slot="right"
          class="mright20"
          @click.native="toggleNightTheme"
        >
          <i class="iconfont icon-light"></i>
          夜间
        </mt-button>
        <mt-button
          slot="right"
          @click.native="mode = 1"
        >
          <i class="iconfont icon-category"></i>
          章节
        </mt-button>
      </mt-header>
      <!-- 顶部功能设置 END -->


      <!-- 底部功能设置 BEGIN -->
      <div
        class="settingFooter"
        v-if="isShowingSetting"
      >
        <div
          class="fontSize"
        >
          <span
            @click="changeFontSize(-1)"
          >T-</span> 
          <span>{{userSetting.fontSize}}</span>
          <span
            @click="changeFontSize(1)"
          >T+</span>
        </div>
        <div
          class="theme"
        >
          <div
            v-for="theme in themes"
            :key="theme.name"
            @click="changeTheme(theme.name)"
          ><span
            :style="{
              backgroundColor: theme.backgroundColor,
            }"
          >
            <i
              class="iconfont icon-selected"
              :class="{
                active: theme.name === userSetting.theme,
              }"
            ></i>
          </span></div>
        </div>
      </div>
      <!-- 底部功能设置 END -->


      <div
        class="fullHeight"
        ref="chapterContent"
      ></div>
      <div
        v-if="showReload"
        class="centerFixed"
        :style="{
          zIndex: 99,
          width: '150px',
          marginLeft: '-75px',
          marginTop: '-25px',
        }"
      >
        <mt-button
          type="primary"
          size="large"
          @click.native="changeChapter(1)"
        >重新加载</mt-button>
      </div>
    </div>

  </div>
</template>
<script src="./detail.js">
</script>
<style lang="sass" src="./detail.sass" scoped></style>
