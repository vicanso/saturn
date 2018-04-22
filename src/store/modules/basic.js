import _ from 'lodash';

import {DEVICE_INFO} from '../mutation-types';
import cordova from '../../helpers/cordova';

const defaultInfo = {
  paddingTop: 0,
  paddingBottom: 0,
  mainNav: 50,
};

const state = {
  device: _.extend({}, defaultInfo),
};

const mutations = {
  [DEVICE_INFO](state, data) {
    data.paddingTop = 0;
    data.paddingBottom = 0;
    // 如果是ios，status bar的位置需要填充安白
    if (data.platform.toLowerCase() === 'ios') {
      const iPhoneX = ['iPhone10,3', 'iPhone10,6'];
      if (_.includes(iPhoneX, data.model)) {
        data.paddingTop = 32;
        data.paddingBottom = 15;
      } else {
        data.paddingTop = 20;
      }
    }
    state.device = _.extend({}, defaultInfo, data);
  },
};

const basicDeviceInfo = async ({commit}) => {
  const data = cordova.getDevice();
  commit(DEVICE_INFO, data);
};

export const actions = {
  basicDeviceInfo,
};

export default {
  state,
  mutations,
};
