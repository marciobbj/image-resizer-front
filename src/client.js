const axios = require("axios");

var axiosInstance = axios.create({
  baseURL: "http://localhost:8000"
  /* other custom settings */
});

module.exports = axiosInstance;
