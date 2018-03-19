import _ from 'lodash';

import {sha256} from './crypto';

export function getErrorMessage(err) {
  let message = err;
  if (err && err.response) {
    const {data, headers} = err.response;
    const id = headers['x-response-id'];
    // eslint-disable-next-line
    const code = data.code.replace(`${APP}-`, '');
    message = `${data.message}(${code}) [${id}]`;
  }
  if (_.isError(message)) {
    message = message.message;
  }
  if (err.code === 'ECONNABORTED') {
    message = '请求超时，请重新再试';
  }
  return message;
}

export function genPassword(account, password) {
  const pwd = sha256(password);
  const app = APP || 'unknown';
  return sha256(`${account}-${pwd}-${app}`);
}

export function getDate(str) {
  const date = new Date(str);
  const fill = v => {
    if (v >= 10) {
      return `${v}`;
    }
    return `0${v}`;
  };
  const month = fill(date.getMonth() + 1);
  const day = fill(date.getDate());
  const hours = fill(date.getHours());
  const mintues = fill(date.getMinutes());
  const seconds = fill(date.getSeconds());
  return `${date.getFullYear()}-${month}-${day} ${hours}:${mintues}:${seconds}`;
}

export function getDefaultColors(type) {
  const colors = {
    gray: {
      backgroundColor: '#d4d4d4',
      color: '#232323',
      boxShadow: '3px 4px 4px rgba(125, 123, 116, 0.8)',
    },
    yellow: {
      backgroundColor: '#a89c84',
      color: '#4e3c26',
      boxShadow: '3px 4px 4px rgba(125, 123, 116, 0.8)',
    },
    black: {
      backgroundColor: '#11100e',
      color: '#2d2c2b',
      boxShadow: '2px 3px 4px rgba(60, 60, 60, 0.8)',
    },
    pinky: {
      backgroundColor: '#494446',
      color: '#2b0c12',
      boxShadow: '2px 3px 4px rgba(60, 60, 60, 0.8)',
    },
  };
  return colors[type];
}
