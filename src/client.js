const axios = require("axios");

var axiosInstance = axios.create({
  baseURL: "http://ec2-3-86-86-236.compute-1.amazonaws.com"
  /* other custom settings */
});

module.exports = axiosInstance;
