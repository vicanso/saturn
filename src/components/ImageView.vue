<template lang="pug">
div(
  :style=`{
    height: '100%',
  }`
)
  img(
    :style=`{
      maxWidth: '100%',
      maxHeight: '100%',
      display: 'block',
      margin: 'auto',
    }`
    v-if="startToLoading"
    :src="imageSrc"
  )
</template>

<script>
import cordova, {Connection} from '../helpers/cordova';
import {
  supportWebp,
} from '../helpers/util';

export default {
  name: 'image-view',
  props: {
    src: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      // 如果为true则加载img
      startToLoading: false,
      imageSrc: '',
    };
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
        let src = this.src;
        if (supportWebp()) {
          src += '?type=webp'
        }
        this.imageSrc = src;
        io.disconnect();
        this.io = null;
        const img = new Image();
        img.onload = () => {
          this.startToLoading = true;
        };
        img.src = src;
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
