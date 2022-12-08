const axios = require("axios");

module.exports = (id) => {
  const baseUrl = "https://youtube.googleapis.com/youtube/v3/";
  axios.get(baseUrl + "video");
};
