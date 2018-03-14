import request from 'axios';
import _ from 'lodash';
import {BOOKS, BOOKS_SOURCES, BOOKS_COVER} from '../../urls';
import {BOOK_HOT_LIST} from '../mutation-types';
const state = {
  hotList: [],
};
const mutations = {
  [BOOK_HOT_LIST](state, data) {
    const items = [].concat(state.hotList).concat(data);
    _.forEach(items, item => {
      // eslint-disable-next-line
      item.cover = URL_PREFIX + BOOKS_COVER.replace(':no', item.no);
    });
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
    fields: 'author name no brief',
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

export const actions = {
  bookHotList,
  bookAddSource,
  bookAdd,
};

export default {
  state,
  mutations,
};
