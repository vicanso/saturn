import request from 'axios';
import _ from 'lodash';
import localforage from 'localforage';

import {sha256} from '../../helpers/crypto';
import {USERS_ME, USERS_REGISTER, USERS_LOGIN} from '../../urls';
import {
  USER_INFO,
  USER_SETTING,
  USER_FAV,
  USER_TOGGLE_FAV,
} from '../mutation-types';
import {genPassword} from '../../helpers/util';

const settingKey = 'user-setting';
const favsKey = 'user-favs';

const state = {
  info: null,
  setting: null,
  favs: null,
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
  const res = await request.post(USERS_REGISTER, {
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

export const actions = {
  userGetInfo,
  userRegister,
  userLogin,
  userGetSetting,
  userSaveSetting,
  userFavsToggle,
  userGetFavs,
};

export default {
  state,
  mutations,
};
