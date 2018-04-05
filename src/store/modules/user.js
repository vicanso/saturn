import request from 'axios';
import _ from 'lodash';
import localforage from 'localforage';

import {sha256} from '../../helpers/crypto';
import {USERS_ME, USERS_LOGIN, BOOKS, BOOKS_COVER} from '../../urls';
import {
  USER_INFO,
  USER_SETTING,
  USER_FAV,
  USER_TOGGLE_FAV,
  USER_FAV_DETAIL,
  USER_FAV_DETAIL_UPDATE,
} from '../mutation-types';
import {genPassword} from '../../helpers/util';

const settingKey = 'user-setting';
const favsKey = 'user-favs';
const readKeyPrefix = 'user-read-';

const state = {
  info: null,
  setting: null,
  favs: null,
  favDetails: null,
};

const mutations = {
  // 用户信息
  [USER_INFO](state, data) {
    const isAdmin = _.includes(data.roles, 'admin');
    state.info = _.extend(
      {
        isAdmin,
      },
      data,
    );
  },
  // 用户设置
  [USER_SETTING](state, data) {
    state.setting = _.clone(data);
  },
  // 用户收藏
  [USER_FAV](state, data) {
    state.favs = data;
  },
  // 用户收藏添加/取消
  [USER_TOGGLE_FAV](state, no) {
    const {favs} = state;
    let found = false;
    const result = [];
    _.forEach(favs, item => {
      if (item.no === no) {
        found = true;
      } else {
        result.push(item);
      }
    });
    if (!found) {
      result.push({
        no,
        createdAt: new Date().toISOString(),
      });
    }
    state.favs = result;
    localforage.setItem(favsKey, result).catch(err => {
      console.error(`save favs fail, ${err.message}`);
    });
  },
  [USER_FAV_DETAIL](state, data) {
    _.forEach(data, item => {
      const latest = _.get(item, 'latestChapter.no');
      const current = _.get(item, 'read.chapterNo');
      if (latest > current) {
        item.new = true;
      }
    });
    state.favDetails = data;
  },
  [USER_FAV_DETAIL_UPDATE](state, {no, readInfo}) {
    const items = state.favDetails;
    let index = -1;
    _.forEach(items, (item, i) => {
      if (item.no === no) {
        index = i;
      }
    });
    if (index === -1) {
      return;
    }
    const found = items[index];
    found.read = readInfo;
    items.splice(index, 1);
    items.unshift(found);
    state.favDetails = items;
  },
};

const userGetInfo = async ({commit}) => {
  const res = await request.get(USERS_ME, {
    params: {
      'cache-control': 'no-cache',
    },
  });
  commit(USER_INFO, res.data);
};

// 用户注册
const userRegister = async ({commit}, {account, password, email}) => {
  const res = await request.post(USERS_ME, {
    account,
    password: genPassword(account, password),
    email,
  });
  commit(USER_INFO, res.data);
};

// 用户登录
const userLogin = async ({commit}, {account, password}) => {
  let res = await request.get(USERS_LOGIN, {
    params: {
      'cache-control': 'no-cache',
    },
  });
  const token = res.data.token;
  const code = sha256(genPassword(account, password) + token);
  res = await request.post(USERS_LOGIN, {
    account,
    password: code,
  });
  commit(USER_INFO, res.data);
};

// 获取用户配置
const userGetSetting = async ({commit}) => {
  const data = await localforage.getItem(settingKey);
  commit(
    USER_SETTING,
    _.extend(
      {
        fontSize: 20,
        theme: 'yellow',
      },
      data,
    ),
  );
};

// 保存用户配置
const userSaveSetting = async ({commit}, data) => {
  const prev = await localforage.getItem(settingKey);
  const result = _.extend(prev, data);
  await localforage.setItem(settingKey, result);
  commit(USER_SETTING, result);
};

// 用户收藏切换
const userFavsToggle = async ({commit}, no) => {
  commit(USER_TOGGLE_FAV, no);
};
// 用户收藏
const userGetFavs = async ({commit}) => {
  const data = await localforage.getItem(favsKey);
  commit(USER_FAV, data || []);
};

// 获取书籍阅读信息
const userGetReadInfo = async (tmp, no) => {
  const key = `${readKeyPrefix}${no}`;
  const data = await localforage.getItem(key);
  return data;
};
// 保存阅读信息
const userSaveReadInfo = async ({commit}, {no, data}) => {
  const key = `${readKeyPrefix}${no}`;
  const now = new Date().toISOString();
  const readInfo = _.extend(
    {
      createdAt: now,
    },
    data,
    {
      updatedAt: now,
    },
  );
  await localforage.setItem(key, readInfo);
  commit(USER_FAV_DETAIL_UPDATE, {
    no,
    readInfo,
  });
};

// 用户收藏书籍详情
const userGetFavsDetail = async ({commit}) => {
  const noList = _.map(state.favs, item => item.no);
  if (noList.length === 0) {
    return [];
  }
  const res = await request.get(BOOKS, {
    params: {
      no: noList.join(','),
      fields: 'no name latestChapter',
    },
  });
  const books = res.data.books;
  const fns = _.map(books, item => {
    // eslint-disable-next-line
    item.cover = URL_PREFIX + BOOKS_COVER.replace(':no', item.no);
    return userGetReadInfo(null, item.no).then(data => {
      item.read = data;
    });
  });
  await Promise.all(fns);
  commit(USER_FAV_DETAIL, books);
};

export const actions = {
  userGetInfo,
  userRegister,
  userLogin,
  userGetSetting,
  userSaveSetting,
  userFavsToggle,
  userGetFavs,
  userGetFavsDetail,
  userGetReadInfo,
  userSaveReadInfo,
};

export default {
  state,
  mutations,
};
