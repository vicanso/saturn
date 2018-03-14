import {mapActions} from 'vuex';

export default {
  data() {
    return {
      name: '',
      author: '',
    };
  },
  methods: {
    ...mapActions(['bookAdd']),
    async submit() {
      const {name, author, submitting} = this;
      if (submitting) {
        return;
      }
      if (!name || !author) {
        this.$toast('必填字段不能为空');
        return;
      }
      const close = this.$loading();
      this.submitting = true;
      try {
        await this.bookAdd({
          name,
          author,
        });
        this.$toast('已添加成功');
      } catch (err) {
        this.$toast(err);
      } finally {
        this.submitting = false;
        close();
      }
    },
  },
};
