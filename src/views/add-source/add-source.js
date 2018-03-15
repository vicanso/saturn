import {mapActions} from 'vuex';

export default {
  data() {
    return {
      source: '',
      name: '',
      author: '',
      id: '',
      sourceList: [
        {
          label: '笔趣阁',
          value: 'biquge',
        },
      ],
    };
  },
  methods: {
    ...mapActions(['bookAddSource']),
    async submit() {
      const {source, name, author, id, submitting} = this;
      if (submitting) {
        return;
      }
      if (!source || !name || !author || !id) {
        this.$toast('必填字段不能为空');
        return;
      }
      const close = this.$loading();
      this.submitting = true;
      try {
        await this.bookAddSource({
          author,
          name,
          source,
          id,
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
