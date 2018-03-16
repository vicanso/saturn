import {mapActions, mapState} from 'vuex';
import _ from 'lodash';
import BookView from '../../components/BookView';
import Intersection from '../../components/Intersection';

export default {
  components: {
    BookView,
    Intersection,
  },
  data() {
    return {
      keyword: '',
      selected: 'hot',
      selectedCategory: 0,
      page: 0,
      searchBooks: null,
      items: [
        {
          id: 'shelf',
          name: '书架',
          cls: 'icon-all',
        },
        {
          id: 'hot',
          name: '精选',
          cls: 'icon-creditlevel',
        },
        {
          id: 'books',
          name: '书库',
          cls: 'icon-viewgallery',
        },
        {
          id: 'find',
          name: '发现',
          cls: 'icon-originalimage',
        },
      ],
    };
  },
  computed: {
    ...mapState({
      hotList: ({book}) => book.hotList,
      categoryList: ({book}) => book.categoryList,
      categoryBooks: ({book}) => book.categoryBooks,
    }),
  },
  watch: {
    keyword() {
      this.debounceSearch();
    },
  },
  methods: {
    ...mapActions([
      'bookHotList',
      'bookCategoryList',
      'bookListByCategory',
      'bookSearch',
    ]),
    // 查询
    async search() {
      const {keyword} = this;
      if (!keyword) {
        this.searchBooks = null;
        return;
      }
      try {
        const data = await this.bookSearch({
          keyword,
        });
        if (this.keyword === keyword) {
          this.searchBooks = data;
        }
      } catch (err) {
        this.$toast(err);
      }
    },
    // 切换分类
    changeCategory(index) {
      this.page = 0;
      this.selectedCategory = index;
      this.listByCategory();
    },
    // 加载更多
    loadMoreByCategory(status) {
      if (status === 1) {
        this.page = this.page + 1;
        this.listByCategory();
      }
    },
    // 按分类查询
    async listByCategory() {
      const {
        page,
        selectedCategory,
        categoryList,
        loadingByCategory,
        categoryBooks,
      } = this;
      if (!categoryList || !categoryList.length) {
        return;
      }
      if (loadingByCategory) {
        return;
      }
      // 如果page为0表示新的分类
      if (page != 0 && categoryBooks.done) {
        return;
      }

      this.loadingByCategory = true;
      const category = categoryList[selectedCategory];
      try {
        await this.bookListByCategory({
          category: category.name,
          page,
        });
      } catch (err) {
        this.$toast(err);
      } finally {
        this.loadingByCategory = false;
      }
    },
  },
  async beforeMount() {
    this.debounceSearch = _.debounce(() => {
      this.search();
    }, 1000);
    const close = this.$loading();
    try {
      await this.bookHotList(0);
    } catch (err) {
      this.$toast(err);
    } finally {
      close();
      this.bookCategoryList()
        .then(() => this.listByCategory())
        .catch(err => {
          this.$toast(err);
        });
    }
  },
};
