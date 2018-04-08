import * as bookModule from './book';
import * as userModule from './user';
import * as basicModule from './basic';

const modules = {};
const actions = {};
const getters = {};

modules.book = bookModule.default;
Object.assign(actions, bookModule.actions);

modules.user = userModule.default;
Object.assign(actions, userModule.actions);

modules.basic = basicModule.default;
Object.assign(actions, basicModule.actions);

export default {
  actions,
  modules,
  getters,
};
