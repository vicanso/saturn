import request from 'axios';
import {
  BOOKS,
} from '../../urls';
import {
  BOOK_HOT_LIST,
} from '../mutation-types';
const state = {
  hotList: [],
};
const mutations = {
  [BOOK_HOT_LIST](state, data) {
    state.hotList = [].concat(state.hotList)
      .concat(data);
  },
};

const bookHotList = async ({ commit }, page) => {
  const limit = 10;
  const skip = limit * page;
  if (state.hotList[skip + limit]) {
    return;
  }
  const params = {
    limit,
    skip,
    fields: 'author name',
  };
  const res = await request.get(BOOKS, {
    params,
  });
  commit(BOOK_HOT_LIST, res.data.list);
};

export const actions = {
  bookHotList,
};

export default {
  state,
  mutations,
};