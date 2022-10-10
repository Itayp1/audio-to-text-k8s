const router = require("express").Router();
const audoTotextConversion = require("../services/audoTotextConversion");
const path = require("path");
const logger = require("elk-logging");
const { v4: uuidv4 } = require("uuid");
const fs = require("fs/promises");
router.post("/convertToText", async ({ body }, res) => {
  if (!body.EncodedAudioFile) {
    res.status(400).send({ err: "missing EncodedAudioFile" });
  }
  let removeFileFlag = false;
  const fileName = `${uuidv4()}.mp3`;
  const filePath = path.join(__dirname, "..", "..", "tmp", fileName);
  logger(`start request convertToText fileName:${fileName}`);
  await fs.writeFile(filePath, body.EncodedAudioFile, "base64");
  removeFileFlag = true;
  try {
    const convertedtext = await audoTotextConversion.convert(filePath);
    fs.unlink(filePath);
    return res.json({ convertedtext });
  } catch (error) {
    fs.unlink(filePath);
    logger(`could not convert file err:${error.message}`);

    return res.status(500).send({ err: error.message });
  }
});

module.exports = router;
