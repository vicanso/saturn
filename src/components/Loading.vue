<template>
  <div class="loading centerFixed">
    <mt-spinner
      type="fading-circle"
      class="pullLeft"
    ></mt-spinner>
    <span>{{tips || "正在加载中..."}}</span>
  </div>
</template>
<script>
export default {
  name: 'Loading',
  props: {
    tips: {
      type: String,
    },
  },
};
</script>

<style lang="sass" scoped>
@import "../variables";
.loading
  $width: 150px
  $height: 30px
  line-height: $height
  width: $width
  margin-left: (-$width / 2)
  margin-top: (-$height / 2)
  color: $COLOR_DARK_GRAY
  span
    margin-left: 10px
</style>
