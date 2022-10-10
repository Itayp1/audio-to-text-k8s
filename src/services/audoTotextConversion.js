const logger = require("elk-logging");
var vosk = require("vosk");
const fs = require("fs");
const { spawn } = require("child_process");
const path = require("path");
const { FFMPEG_PATH, MODEL_PATH } = require("../../server.config");

SAMPLE_RATE = 16000;
BUFFER_SIZE = 4000;

if (!fs.existsSync(MODEL_PATH)) {
  logger("Please download the model from https://alphacephei.com/vosk/models and unpack as " + MODEL_PATH + " in the current folder.");
  process.exit();
}

vosk.setLogLevel(0);

const model = new vosk.Model(MODEL_PATH);
const rec = new vosk.Recognizer({ model: model, sampleRate: SAMPLE_RATE });

const convert = async (fileName) => {
  let chunk = "";

  return new Promise((resolve, reject) => {
    const ffmpeg_run = spawn(FFMPEG_PATH, ["-loglevel", "quiet", "-i", fileName, "-ar", String(SAMPLE_RATE), "-ac", "1", "-f", "s16le", "-bufsize", String(BUFFER_SIZE), "-"]);
    ffmpeg_run.stdout.on("data", (stdout) => {
      if (rec.acceptWaveform(stdout)) {
        logger("acceptWaveform");
        chunk = rec.result().text;
      }
    });
    ffmpeg_run.stdout.on("end", (rr) => {
      logger(`end data ${chunk}`);
      return resolve(chunk);
    });
  });
};

module.exports = { convert };
