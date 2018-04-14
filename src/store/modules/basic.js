import _ from 'lodash';

import {DEVICE_INFO} from '../mutation-types';
import cordova from '../../helpers/cordova';

const state = {
  device: {
    padding: 0,
  },
};

const mutations = {
  [DEVICE_INFO](state, data) {
    // 如果是ios，status bar的位置需要填充安白
    if (data.platform.toLowerCase() === 'ios') {
      const iPhoneX = ['iPhone10,3', 'iPhone10,6'];
      if (_.includes(iPhoneX, data.model)) {
        data.padding = 32;
      } else {
        data.padding = 20;
      }
    } else {
      data.padding = 0;
    }
    state.device = data;
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
