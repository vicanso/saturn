import {DEVICE_INFO} from '../mutation-types';

import cordova from '../../helpers/cordova';

const state = {
  device: {
    padding: '0px',
  },
};

const mutations = {
  [DEVICE_INFO](state, data) {
    // 如果是ios，status bar的位置需要填充安白
    if (data.platform.toLowerCase() === 'ios') {
      data.padding = '20px';
    } else {
      data.padding = '0px';
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
