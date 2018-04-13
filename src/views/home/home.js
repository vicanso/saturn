import {mapActions, mapState} from 'vuex';
import _ from 'lodash';
import Hammer from 'hammerjs';

import BookView from '../../components/BookView';
import Intersection from '../../components/Intersection';
import Loading from '../../components/Loading';
import ImageView from '../../components/ImageView';
import cordova from '../../helpers/cordova';
import {waitFor} from '../../helpers/util';

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
      isLoadingFavs: false,
      showUnfav: false,
      requestBook: {},
      loadHotBooksDone: false,
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
      deviceInfo: ({basic}) => basic.device,
    }),
  },
  watch: {
    keyword() {
      this.debounceSearch();
    },
    async selected(v) {
      // 如果是首次点击书库分类，加载数据
      switch (v) {
        case 'books': {
          if (!this.categoryListLoaded) {
            try {
              await this.bookCategoryList();
              await this.listByCategory();
              this.categoryListLoaded = true;
            } catch (err) {
              this.$toast(err);
            }
          }
          break;
        }
        case 'shelf': {
          this.isLoadingFavs = true;
          const startedAt = Date.now();
          try {
            await this.userGetFavsDetail();
            this.initFavEvent();
          } catch (err) {
            this.$toast(err);
          } finally {
            await waitFor(300, startedAt);
            this.isLoadingFavs = false;
          }
          break;
        }
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
      'bookRequestAdd',
    ]),
    async requestAdd() {
      const {author, name} = this.requestBook;
      if (!author || !name) {
        this.$toast('作者与书名不能为空');
        return;
      }
      const close = this.$loading();
      try {
        await this.bookRequestAdd({
          author,
          name,
        });
        this.requestBook = {};
      } catch (err) {
        this.$toast(err);
      } finally {
        close();
      }
    },
    async initFavEvent() {
      if (this.favBooksHammer) {
        return;
      }
      await this.$next();
      const favBooks = this.$refs.favBooks;
      if (!favBooks) {
        return;
      }
      this.favBooksHammer = new Hammer(favBooks);
      this.favBooksHammer.on('press', () => {
        this.showUnfav = !this.showUnfav;
      });
    },
    async removeFromShelf(no) {
      try {
        await this.userFavsToggle(no);
      } catch (err) {
        this.$toast(err);
      }
    },
    showDetail(no, e) {
      if (this.showUnfav) {
        // 如果点击的是移除，则移除小说
        if (e.target.tagName === 'A') {
          this.removeFromShelf(no);
        }
        this.showUnfav = false;
        return;
      }
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
      if (this.selectedCategory === index) {
        return;
      }
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
    try {
      await cordova.waitForReady();
      await this.loadMoreHotBooks();
    } catch (err) {
      this.$toast(err);
    }
  },
};
