import { mapActions } from 'vuex';

export default {
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
  methods: {
    ...mapActions([
      'bookHotList',
    ]),
  },
  beforeMount() {
    this.bookHotList(0);
  },
};