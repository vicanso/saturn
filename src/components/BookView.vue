<template>
  <div class="bookView">
    <div class="imageView">
      <image-view
        :src="book.cover"
      />
    </div>
    <div class="contentView">
      <h3 class="font16">{{book.name}}</h3>
      <p class="font14">{{book.brief}}</p>
      <div
        class="pullRight"
      >
        <span
          class="category"
          v-if="book.category && book.category[0]"
        >{{book.category[0]}}</span>
        <span class="category">{{Math.ceil(book.wordCount / 10000) + '万字'}}</span>
      </div>
      <div
        class="font14 ellipsis author"
      >{{book.author}}</div>
    </div>
  </div>
</template>

<script>
import ImageView from './ImageView';
export default {
  name: 'book-view',
  components: {
    ImageView,
  },
  props: {
    book: {
      type: Object,
      required: true,
    },
  },
};
</script>
<style lang="sass" scoped>
@import "../variables"
$imageViewWidth: 100px
.imageView
  width: $imageViewWidth
  height: 100%
  float: left
  overflow: hidden
.contentView
  margin-left: $imageViewWidth + 10px
  h3
    margin: 0
    padding: 0
    line-height: 30px
  p
    margin: 0
    $lineHeight: 25px
    line-height: $lineHeight 
    height: 2 * $lineHeight 
    overflow: hidden
    color: $COLOR_DARK_GRAY
  .category
    border-radius: 3px
    margin: 0
    margin-left: 5px
    padding: 1px 4px
    font-size: 14px
    &:nth-child(2n)
      color: $COLOR_DARK_GRAY
      border: 1px solid $COLOR_DARK_GRAY
    &:nth-child(2n + 1)
      color: $COLOR_DARK_BLUE
      border: 1px solid $COLOR_DARK_BLUE
  .author
    color: $COLOR_DARK_GRAY
</style>
