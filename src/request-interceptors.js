import request from 'axios';

import {urlPrefix} from './config';

request.interceptors.request.use(conf => {
  if (!conf.timeout) {
    conf.timeout = 10 * 1000;
  }
  conf.url = `${urlPrefix}${conf.url}`;
  return conf;
});
