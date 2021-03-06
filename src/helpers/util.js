import _ from 'lodash';
import * as Velocity from 'velocity-animate';

import {sha256} from './crypto';
import {app} from '../config';

// 获取出错信息
export function getErrorMessage(err) {
  let message = err;
  if (err && err.response) {
    const {data, headers} = err.response;
    if (data && data.code) {
      const id = headers['x-response-id'];
      // eslint-disable-next-line
      const code = data.code.replace(`${app}-`, '');
      message = `${data.message}(${code}) [${id}]`;
    }
  }
  if (_.isError(message)) {
    message = message.message;
  }
  if (err.code === 'ECONNABORTED') {
    message = '请求超时，请重新再试';
  }
  return message;
}

// 生成密码
export function genPassword(account, password) {
  const pwd = sha256(password);
  return sha256(`${account}-${pwd}-${app}`);
}

// 获取日期格式化字符串
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

// 获取默认的颜色配置
export function getDefaultColors() {
  const shadow = '3px 6px 4px';
  const colors = {
    gray: {
      backgroundColor: '#d4d4d4',
      color: '#232323',
      boxShadow: `${shadow} rgba(125, 123, 116, 0.8)`,
    },
    yellow: {
      backgroundColor: '#a89c84',
      color: '#4e3c26',
      boxShadow: `${shadow} rgba(125, 123, 116, 0.8)`,
    },
    black: {
      backgroundColor: '#11100e',
      color: '#2d2c2b',
      boxShadow: `${shadow} rgba(30, 30, 30, 0.8)`,
    },
    pinky: {
      backgroundColor: '#494446',
      color: '#2b0c12',
      boxShadow: `${shadow} rgba(60, 60, 60, 0.8)`,
    },
  };
  return colors;
}

// 等待ttl时长
export function waitFor(ttl, startedAt) {
  let delay = ttl;
  if (startedAt) {
    delay = ttl - (Date.now() - startedAt);
  }
  return new Promise(resolve => {
    setTimeout(resolve, Math.max(0, delay));
  });
}

// 将滚动条滚动至top
export function scrollTop(element, top, options) {
  if (!element) {
    return;
  }
  const offset = -element.scrollTop + top;
  const opts = _.extend(
    {
      container: element,
      duration: 300,
      offset,
    },
    options,
  );
  Velocity(element, 'scroll', opts);
}

let isSupportWebp = false;
(function() {
  const images = {
    basic:
      'data:image/webp;base64,UklGRjIAAABXRUJQVlA4ICYAAACyAgCdASoCAAEALmk0mk0iIiIiIgBoSygABc6zbAAA/v56QAAAAA==',
    lossless:
      'data:image/webp;base64,UklGRh4AAABXRUJQVlA4TBEAAAAvAQAAAAfQ//73v/+BiOh/AAA=',
  };
  const check = data =>
    new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = resolve;
      img.onerror = reject;
      img.src = data;
    });
  Promise.all(_.map(images, check))
    .then(() => true)
    .catch(() => false)
    .then(result => {
      isSupportWebp = result;
    });
})();

export function supportWebp() {
  return isSupportWebp;
}
