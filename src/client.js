const axios = require('axios');

var axiosInstance = axios.create({
  baseURL: 'http://image-resizer-api',
  /* other custom settings */
});

module.exports = axiosInstance;
