<template>
  <div>
  </div>
</template>
<script>
export default {
  name: 'intersection',
  mounted() {
    const io = new IntersectionObserver(entries => {
      const target = entries[0];
      if (target.isIntersecting && this.hidden) {
        this.hidden = false;
        this.$emit('intersection', 1);
      } else if (!target.isIntersecting && !this.hidden) {
        this.hidden = true;
        this.$emit('intersection', 0);
      }
    });
    io.observe(this.$el);
    this.io = io;
  },
  beforeCreate() {
    this.hidden = true;
  },
  beforeDestroy() {
    if (this.io) {
      this.io.disconnect();
    }
  },
};
</script>
