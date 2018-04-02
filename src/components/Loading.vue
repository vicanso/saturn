<template lang="pug">
.loading.centerFixed
  mt-spinner.pullLeft(
    type="fading-circle"
  )
  span {{tips || "正在加载中..."}}
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
