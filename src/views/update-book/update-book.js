import _ from 'lodash';
import {mapActions} from 'vuex';
import {MessageBox} from 'mint-ui';
import {getDate} from '../../helpers/util';

function convert(item) {
  let key = item.name;
  if (item.latestChapter) {
    key = `${key}（${item.latestChapter.title}）`;
  }
  return {
    name: item.name,
    key,
    no: item.no,
    updatedAt: getDate(item.updatedAt).substring(5),
  };
}

export default {
  data() {
    return {
      items: null,
      keywords: '',
    };
  },
  methods: {
    ...mapActions(['bookList', 'bookUpdateInfo']),
    async update(item) {
      try {
        await MessageBox.confirm(`确认更新${item.name}吗？`);
        this.bookUpdateInfo(item.no);
      } catch (err) {
        console.error(err);
      }
    },
    async refreshBookList() {
      const {keywords} = this;
      const query = {};
      if (keywords) {
        query.keywords = keywords;
      }
      const data = await this.bookList(query);
      this.items = _.map(data.list, convert);
    },
  },
  async beforeMount() {
    const close = this.$loading();
    try {
      await this.refreshBookList();
    } catch (err) {
      this.$toast(err);
    } finally {
      close();
    }
  },
};
