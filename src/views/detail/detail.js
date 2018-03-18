import {mapActions} from 'vuex';

import ImageView from '../../components/ImageView';
import {getDate} from '../../helpers/util';

export default {
  components: {
    ImageView,
  },
  data() {
    return {
      book: null,
      title: '...',
      updatedAt: '',
    };
  },
  methods: {
    ...mapActions(['bookGetDetail']),
  },
  async beforeMount() {
    const close = this.$loading();
    const {no} = this.$route.params;
    try {
      const data = await this.bookGetDetail(no);
      const {name, latestChapter} = data;
      this.title = name;
      if (latestChapter) {
        const date = getDate(latestChapter.updatedAt);
        this.updatedAt = date.substring(11, 16);
      }
      this.book = data;
    } catch (err) {
      this.$toast(err);
    } finally {
      close();
    }
  },
};
