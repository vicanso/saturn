<template lang="pug">
.imageWrapper(
  ref="wrapper"
)
  img(
    v-if="startToLoading"
    :src="imageSrc"
    ref="imgDom"
  )
  .loading.tac.font12(
    v-else
  ) {{loadingText}}
</template>

<script>
import cordova, {Connection} from '../helpers/cordova';
import {supportWebp} from '../helpers/util';

export default {
  name: 'image-view',
  props: {
    src: {
      type: String,
      required: true,
    },
    fixedCenter: {
      type: Boolean,
    },
  },
  data() {
    return {
      // 如果为true则加载img
      startToLoading: false,
      imageSrc: '',
      loadingText: '加载中...',
    };
  },
  methods: {
    fixed(img) {
      const {wrapper} = this.$refs;
      const {clientHeight, clientWidth} = wrapper;
      const {width, height} = img;
      if (height / clientHeight > width / clientWidth) {
        const newWidth = Math.floor(width * (clientHeight / height));
        wrapper.style.paddingLeft = `${(clientWidth - newWidth) / 2}px`;
      } else {
        const newHeight = Math.floor(height * (clientWidth / width));
        wrapper.style.paddingTop = `${(clientHeight - newHeight) / 2}px`;
      }
    },
    load() {
      const {io, fixedCenter} = this;
      let src = this.src;
      if (supportWebp()) {
        src += '?type=webp&quality=80';
      } else {
        src += '?quality=90';
      }
      this.imageSrc = src;
      io.disconnect();
      this.io = null;
      const img = new Image();
      img.onload = () => {
        if (fixedCenter) {
          this.fixed(img);
        }
        this.startToLoading = true;
      };
      img.src = src;
    },
  },
  mounted() {
    const io = new IntersectionObserver(entries => {
      const target = entries[0];
      // 在元素可见时加载图标，并做diconnect
      if (target.isIntersecting) {
        const type = cordova.getConnectionType();
        if (type != Connection.wifi) {
          return;
        }
        this.load();
      }
    });
    io.observe(this.$el);
    this.io = io;
  },
  beforeDestroy() {
    // 如果在删除时，若没有disconnect，调用disconnect
    if (this.io) {
      this.io.disconnect();
    }
  },
};
</script>

<style lang="sass" scoped>
@import "../variables"
.imageWrapper
  height: 100%
  background-image: url('../assets/default-cover.png')
  background-position: center
  background-repeat: no-repeat
  background-size: 64px
  position: relative
  img
    max-width: 100%
    max-height: 100%
    display: block
    margin: auto
  .loading
    position: absolute
    bottom: 5px
    left: 0
    right: 0
    color: $COLOR_DARK_GRAY
</style>
