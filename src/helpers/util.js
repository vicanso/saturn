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

export const genPassword = (account, password) => {
  const pwd = sha256(password);
  const app = APP || 'unknown';
  return sha256(`${account}-${pwd}-${app}`);
};
