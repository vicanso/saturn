<template>
  <div class="fullHeight">
    <mt-header
      :title="title"
      fixed
      v-if="mode !== 2"
    >
      <mt-button
        icon="back"
        slot="left"
        @click="back"
      ></mt-button>
    </mt-header>
    <div
      class="functionView"
      v-if="mode === 0"
    >
      <a
        href="javascript:;"
      >下载</a>
      <a
        href="javascript:;"
        class="read"
        @click="goOnReading"
      >免费阅读</a>
      <a
        href="javascript:;"
      >加入书架</a>
    </div>
    <div
      v-if="book && mode === 0"
      class="bookView fullHeight"
    ><div class="fullHeightScroll">
      <div
        class="infoView"
      >
        <div
          class="clearfix"
          :style="{
            padding: '15px',
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
    <div
      v-if="mode === 1"
      class="chaptersView fullHeight"
    >
      <p
        class="tac"
        v-if="!chapters"
      >正在加载中，请稍候...</p>
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
    <div
      v-if="mode === 2"
      class="fullHeight"
    >
      <mt-header
        title=""
        fixed
        v-if="isShowingSetting"
      >
        <mt-button
          icon="back"
          slot="left"
          @click="back"
        ></mt-button>
      </mt-header>
      <div
        class="fullHeight"
        ref="chapterContent"
      ></div>
    </div>
  </div>
</template>
<script src="./detail.js">
</script>
<style lang="sass" src="./detail.sass" scoped></style>
