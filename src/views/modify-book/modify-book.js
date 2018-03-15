import {mapActions} from 'vuex';

export default {
  data() {
    return {
      keyword: '',
      result: null,
    };
  },
  methods: {
    ...mapActions(['bookList', 'bookUpdate']),
    async serach() {
      const {keyword} = this;
      if (!keyword) {
        this.$toast('请先输入关键字');
        return;
      }
      const close = this.$loading();
      try {
        const data = await this.bookList({
          keyword,
        });
        this.result = _.map(data.list, item => {
          return _.extend(
            {
              categoryOptions: ['玄幻', '都市', '仙侠', '科幻', '游戏', '历史'],
              category: [],
            },
            item,
          );
        });
      } catch (err) {
        this.$toast(err);
      } finally {
        close();
      }
    },
    async submit(data) {
      if (this.submitting) {
        return;
      }
      const {end, brief, no, category} = data;
      const close = this.$loading();
      this.submitting = true;
      try {
        await this.bookUpdate({
          no,
          end,
          brief,
          category,
        });
      } catch (err) {
        this.$toast(err);
      } finally {
        this.submitting = false;
        close();
      }
    },
  },
};
