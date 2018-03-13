import request from 'axios';

request.interceptors.request.use((config) => {
  if (!config.timeout) {
    config.timeout = 10 * 1000;
  }
  config.url = `/api${config.url}`;
  return config;
});
