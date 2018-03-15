<template>
  <div class="fullHeightScroll">
    <mt-header
      title="更新书籍信息"
    >
      <mt-button
        icon="back"
        slot="left"
        @click="$router.back()"
      ></mt-button>
    </mt-header>
    <mt-search
      @keyup.enter.native="serach"
      v-model="keyword"
      autofocus
      :style="{
        height: '45px'
      }"
    >
    </mt-search>
    <div
      v-for="item in result"
      :key="item.name"
      class="bookView"
    >
      <mt-field
        class="fieldItem"
        label="名称"
        v-model="item.name"
        disabled
      ></mt-field>
      <mt-field
        class="fieldItem"
        label="作者"
        v-model="item.author"
        disabled
      ></mt-field>
      <mt-field
        class="fieldItem"
        label="是否完结"
      >
        <mt-switch
          v-model="item.end"
        ></mt-switch>
      </mt-field>
      <mt-checklist
        class="fieldItem"
        title="类别"
        v-model="item.category"
        :options="item.categoryOptions"
      ></mt-checklist>
      <mt-field
        class="fieldItem"
        label="简介"
        v-model="item.brief"
        type="textarea"
        rows="4"
      ></mt-field>
      <mt-button
        type="primary"
        size="large"
        @click="submit(item)"
      >提交</mt-button>
    </div>
  </div>
</template>

<script src='./modify-book.js'>
</script>
<style lang="sass" scoped>
@import '../../variables';
.fieldItem
  border-bottom: $GRAY_BORDER
.bookView
  margin-bottom: 30px
  &:last-child
    margin-bottom: 0px
</style>
