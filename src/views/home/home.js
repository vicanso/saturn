import {mapActions, mapState} from 'vuex';
import _ from 'lodash';
import BookView from '../../components/BookView';
import Intersection from '../../components/Intersection';
import Loading from '../../components/Loading';
import ImageView from '../../components/ImageView';

export default {
  components: {
    BookView,
    Intersection,
    Loading,
    ImageView,
  },
  data() {
    return {
      keyword: '',
      selected: 'hot',
      selectedCategory: 0,
      categorPage: 0,
      hotPage: 0,
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
      favBooks: ({user}) => user.favDetails,
    }),
  },
  watch: {
    keyword() {
      this.debounceSearch();
    },
    selected(v) {
      // 如果是首次点击书库分类，加载数据
      switch (v) {
        case 'books':
          if (!this.categoryListLoaded) {
            this.bookCategoryList()
              .then(() => this.listByCategory())
              .then(() => {
                this.categoryListLoaded = true;
              })
              .catch(err => {
                this.$toast(err);
              });
          }
          break;
        case 'shelf':
          this.userGetFavsDetail().catch(err => {
            this.$toast(err);
          });
          break;
      }
    },
  },
  methods: {
    ...mapActions([
      'bookHotList',
      'bookCategoryList',
      'bookListByCategory',
      'bookSearch',
      'userGetFavsDetail',
      'userFavsToggle',
    ]),
    async removeFromShelf(no) {
      try {
        await this.userFavsToggle(no);
        this.favBooks = _.filter(this.favBooks, item => item.no !== no);
      } catch (err) {
        this.$error(err);
      }
    },
    showDetail(no) {
      this.$router.push({
        name: 'detail',
        params: {
          no,
        },
      });
    },
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
      this.categorPage = 0;
      this.selectedCategory = index;
      this.listByCategory();
    },
    // 加载更多
    loadMoreByCategory(status) {
      if (status === 1) {
        this.categorPage = this.categorPage + 1;
        this.listByCategory();
      }
    },
    // 按分类查询
    async listByCategory() {
      const {
        categorPage,
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
      if (categorPage != 0 && categoryBooks.done) {
        return;
      }

      this.loadingByCategory = true;
      const category = categoryList[selectedCategory];
      try {
        await this.bookListByCategory({
          category: category.name,
          page: categorPage,
        });
      } catch (err) {
        this.$toast(err);
      } finally {
        this.loadingByCategory = false;
      }
    },
    // 加载更多的热门书籍
    async loadMoreHotBooks() {
      if (this.loadingHotBooks || this.loadHotBooksDone) {
        return;
      }
      this.loadingHotBooks = true;
      try {
        const data = await this.bookHotList(this.hotPage);
        this.hotPage += 1;
        // 如果已经到最底
        if (data && data.books.length === 0) {
          this.loadHotBooksDone = true;
        }
      } catch (err) {
        this.$toast(err);
      } finally {
        _.delay(() => {
          this.loadingHotBooks = false;
        }, 1000);
      }
    },
  },
  async beforeMount() {
    this.debounceSearch = _.debounce(() => {
      this.search();
    }, 1000);
    const close = this.$loading();
    try {
      await this.loadMoreHotBooks();
    } catch (err) {
      this.$toast(err);
    } finally {
      close();
    }
  },
};
