import request from 'axios';
import _ from 'lodash';
import {
  BOOKS,
  BOOKS_SOURCES,
  BOOKS_COVER,
  BOOKS_INFO,
  BOOKS_DETAIL,
  BOOKS_CATEGORIES,
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
  };
  const res = await request.get(BOOKS, {
    params,
  });
  commit(BOOK_HOT_LIST, res.data.list);
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
  // const limit = 10;
  const limit = 4;
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
};

export default {
  state,
  mutations,
};
