<template lang="pug">
.bookView
  .imageView
    image-view(
      :src="book.cover"
    )
  .contentView
    h3.font16 {{book.name}}
    p.font14 {{book.brief}}
    .pullRight
      span.category(
        v-if="book.category && book.category[0]"
      ) {{book.category[0]}}
      span.category {{Math.ceil(book.wordCount / 10000) + '万字'}}
    .author.ellipsis.font14 {{book.author}}
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
    margin: 0 0 10px 0
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
