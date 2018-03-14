const path = require('path');

exports.port = 5018;

exports.env = process.env.NODE_ENV || 'development';

exports.distPath = path.join(__dirname, './dist');
