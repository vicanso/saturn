import {mapActions, mapState} from 'vuex';
import ImageView from '../../components/ImageView';

export default {
  components: {
    ImageView,
  },
  data() {
    return {
      selected: 'hot',
      items: [
        {
          id: 'shelf',
          name: '书架',
        },
        {
          id: 'hot',
          name: '精选',
        },
        {
          id: 'books',
          name: '书库',
        },
        {
          id: 'find',
          name: '发现',
        },
      ],
    };
  },
  computed: {
    ...mapState({
      hotList: ({book}) => book.hotList,
    }),
  },
  methods: {
    ...mapActions(['bookHotList']),
  },
  async beforeMount() {
    const close = this.$loading();
    try {
      this.bookHotList(0);
    } catch (err) {
      this.$toast(err);
    } finally {
      close();
    }
  },
};
