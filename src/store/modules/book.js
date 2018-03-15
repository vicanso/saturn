import request from 'axios';
import _ from 'lodash';
import {
  BOOKS,
  BOOKS_SOURCES,
  BOOKS_COVER,
  BOOKS_INFO,
  BOOKS_DETAIL,
} from '../../urls';
import {BOOK_HOT_LIST} from '../mutation-types';
const state = {
  hotList: [],
};
const mutations = {
  [BOOK_HOT_LIST](state, data) {
    _.forEach(data, item => {
      // eslint-disable-next-line
      item.cover = URL_PREFIX + BOOKS_COVER.replace(':no', item.no);
    });
    const items = [].concat(state.hotList).concat(data);
    state.hotList = items;
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

export const actions = {
  bookHotList,
  bookAddSource,
  bookAdd,
  bookList,
  bookUpdateInfo,
  bookUpdate,
};

export default {
  state,
  mutations,
};
