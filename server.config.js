require("dotenv").config();
const path = require("path");

process.env.NODE_TLS_REJECT_UNAUTHORIZED = 0;
process.env.ENV = process.env.ENV || "qa";
module.exports = {
  PORT: parseInt(process.env.PORT || 3000),
  SERVICE_NAME: process.env.SERVICE_NAME || "audio-to-text",
  MODEL_PATH: path.join(__dirname, "model"),
  FFMPEG_PATH: process.env.FFMPEG_PATH || path.join(__dirname, "ffmpeg.exe"),
};
