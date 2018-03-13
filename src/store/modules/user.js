import request from 'axios';
import { sha256 } from '../../helpers/crypto';

import {
  USERS_ME,
  USERS_REGISTER,
  USERS_LOGIN,
} from '../../urls';
import {
  USER_INFO
} from '../mutation-types';
import {
  genPassword,
} from '../../helpers/util';

const state = {
  userInfo: null,
};

const mutations = {
  [USER_INFO](state, data) {
    state.userInfo = data;
  },
};

const userGetInfo = async ({ commit }) => {
  const res = await request.get(USERS_ME, {
    params: {
      'cache-control': 'no-cache',
    },
  });
  commit(USER_INFO, res.data);
};

// 用户注册
const userRegister = async ({ commit }, { account, password, email }) => {
  const res = await request.post(USERS_REGISTER, {
    account,
    password: genPassword(account, password),
    email,
  });
  commit(USER_INFO, res.data);
};

// 用户登录
const userLogin = async ({ commit }, { account, password }) => {
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

export const actions = {
  userGetInfo,
  userRegister,
  userLogin,
};

export default {
  state,
  mutations,
};
