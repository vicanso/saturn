import request from 'axios';
import _ from 'lodash';
import localforage from 'localforage';
import {
  BOOKS,
  BOOKS_SOURCES,
  BOOKS_COVER,
  BOOKS_INFO,
  BOOKS_DETAIL,
  BOOKS_CATEGORIES,
  BOOKS_CHAPTERS,
} from '../../urls';
import {
  BOOK_HOT_LIST,
  BOOK_CATEGORY_LIST,
  BOOK_LIST_BY_CATEGORY,
} from '../mutation-types';
const state = {
  hotList: [],
  categoryList: [],
  categoryBooks: {
    count: -1,
    items: [],
    done: false,
  },
};
const genCover = item => {
  // eslint-disable-next-line
  item.cover = URL_PREFIX + BOOKS_COVER.replace(':no', item.no);
};
const chapterKeyPrefix = 'book-chapter-';
const readKeyPrefix = 'book-read-';

const mutations = {
  [BOOK_HOT_LIST](state, data) {
    _.forEach(data, genCover);
    const items = [].concat(state.hotList).concat(data);
    state.hotList = items;
  },
  [BOOK_CATEGORY_LIST](state, data) {
    state.categoryList = data;
  },
  [BOOK_LIST_BY_CATEGORY](state, data) {
    const {categoryBooks} = state;
    const {reset, list} = data;
    _.forEach(list, genCover);
    if (reset) {
      categoryBooks.items = list;
      categoryBooks.count = data.count;
      categoryBooks.done = false;
    } else {
      categoryBooks.items = [].concat(categoryBooks.items).concat(list);
    }
    if (categoryBooks.items.length === categoryBooks.count) {
      categoryBooks.done = true;
    }
  },
};

// 获取热门书籍列表
const bookHotList = async ({commit}, page) => {
  const limit = 10;
  const skip = limit * page;
  if (state.hotList[skip + limit]) {
    return;
  }
  const params = {
    limit,
    skip,
    fields: 'author name no brief wordCount category',
    sort: '-latestChapter.updatedAt',
  };
  const res = await request.get(BOOKS, {
    params,
  });
  commit(BOOK_HOT_LIST, res.data.list);
  return res.data;
};

// 增加书籍来源
const bookAddSource = async (tmp, {source, name, author, id}) => {
  await request.post(BOOKS_SOURCES, {
    source,
    author,
    name,
    id,
  });
};

// 增加书籍
const bookAdd = async (tmp, {name, author}) => {
  await request.post(BOOKS, {
    name,
    author,
  });
};

// 查询书籍
const bookList = async (tmp, query) => {
  const res = await request.get(BOOKS, {
    params: query,
  });
  return res.data;
};

// 更新书籍信息
const bookUpdateInfo = async (tmp, no) => {
  const res = await request.patch(BOOKS_INFO.replace(':no', no));
  return res.data;
};

// 更新书籍
const bookUpdate = async (tmp, {no, end, brief, category}) => {
  const res = await request.patch(BOOKS_DETAIL.replace(':no', no), {
    end,
    brief,
    category,
  });
  return res.data;
};

// 获取书籍分类
const bookCategoryList = async ({commit}) => {
  const res = await request.get(BOOKS_CATEGORIES);
  commit(BOOK_CATEGORY_LIST, _.get(res, 'data.list', []));
};

// 按分类展示小说
const bookListByCategory = async ({commit}, {category, page}) => {
  const limit = 10;
  const skip = limit * page;
  const params = {
    limit,
    skip,
    fields: 'author name no brief wordCount category',
    category,
  };
  if (page === 0) {
    params.count = true;
  }
  const res = await request.get(BOOKS, {
    params,
  });
  const reset = page === 0;
  commit(BOOK_LIST_BY_CATEGORY, {
    list: res.data.list,
    count: res.data.count,
    reset,
  });
};

// 书籍查询
const bookSearch = async (tmp, {keyword}) => {
  const res = await request.get(BOOKS, {
    params: {
      keyword,
      limit: 20,
      fields: 'no name author',
    },
  });
  return res.data.list;
};

// 获取书籍详情
const bookGetDetail = async (tmp, no) => {
  const res = await request.get(BOOKS_DETAIL.replace(':no', no));
  const item = res.data;
  genCover(item);
  return item;
};

// 获取书籍章节
const bookChapterList = async (tmp, {no, limit = 10, fields, skip = 0}) => {
  const res = await request.get(BOOKS_CHAPTERS.replace(':no', no), {
    params: {
      fields,
      limit,
      skip,
    },
  });
  return _.get(res, 'data.list', []);
};

// 获取书籍阅读信息
const bookGetReadInfo = async (tmp, no) => {
  const key = `${readKeyPrefix}${no}`;
  const data = await localforage.getItem(key);
  return data;
};
// 保存阅读信息
const bookSaveReadInfo = async (tmp, {no, data}) => {
  const key = `${readKeyPrefix}${no}`;
  await localforage.setItem(
    key,
    _.extend(
      {
        createdAt: new Date().toISOString(),
      },
      data,
    ),
  );
};

// 清除过期的章节数据
const clearExpiredChapters = async () => {
  const oneWeek = 7 * 24 * 3600 * 1000;
  const expiredDate = new Date(Date.now() - oneWeek).toISOString();
  localforage.iterate((value, key) => {
    // 非chapter的数据不处理
    if (key.indexOf(chapterKeyPrefix) !== 0) {
      return;
    }
    // 未过期的数据不处理
    if (value.createdAt > expiredDate) {
      return;
    }
    localforage.removeItem(key).catch(err => {
      console.error(`localforage remove ${key} fail, ${err.message}`);
    });
  });
};

// 获取书籍章节内容
const bookChapterDetail = async (tmp, {no, chapterNo}) => {
  const key = `${chapterKeyPrefix}${no}-${chapterNo}`;
  const data = await localforage.getItem(key);
  if (data) {
    return data;
  }
  const limit = 5;
  const start = Math.floor(chapterNo / limit) * limit;
  const offset = chapterNo - start;
  const res = await request.get(BOOKS_CHAPTERS.replace(':no', no), {
    params: {
      fields: 'data title',
      limit,
      skip: start,
    },
  });
  const list = _.get(res, 'data.list');
  if (!list || !list[offset]) {
    throw new Error('获取数据失败');
  }
  _.defer(() => {
    const createdAt = new Date().toISOString();
    const fns = _.map(list, (item, index) => {
      const itemKey = `${chapterKeyPrefix}${no}-${start + index}`;
      return localforage.setItem(itemKey, {
        createdAt,
        title: item.title,
        content: item.data,
      });
    });
    Promise.all(fns)
      .then(() => {
        // eslint-disable-next-line
        console.info('save chapters success');
      })
      .catch(err => {
        // eslint-disable-next-line
        console.error(`save chapter fail, ${err.message}`);
      });
    clearExpiredChapters().catch(err => {
      console.error(`clear expired chapters fail, ${err.message}`);
    });
  });
  const result = list[offset];
  return {
    title: result.title,
    content: result.data,
  };
};

export const actions = {
  bookHotList,
  bookAddSource,
  bookAdd,
  bookList,
  bookUpdateInfo,
  bookUpdate,
  bookCategoryList,
  bookListByCategory,
  bookSearch,
  bookGetDetail,
  bookChapterList,
  bookChapterDetail,
  bookSaveReadInfo,
  bookGetReadInfo,
};

export default {
  state,
  mutations,
};
