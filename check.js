const http = require('http');

const config = require('./config');

const options = {
  hostname: '127.0.0.1',
  port: config.port,
  path: '/ping',
  method: 'GET',
};

const req = http.request(options, res => {
  res.on('end', () => {
    if (res.statusCode !== 200) {
      process.exit(1);
      return;
    }
    process.exit(0);
  });
});

req.on('error', () => {
  process.exit(1);
});
req.end();
