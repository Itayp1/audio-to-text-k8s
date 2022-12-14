const conf = require("../server.config");
const bodyParser = require("body-parser");
const helmet = require("helmet");
const compression = require("compression");
const logger = require("elk-logging");
const express = require("express");
const app = express();

const routes = require("./routes/index");
// Health Check endpoints
app.get("/health", async (req, res) => {
  res.status(200).send({ status: "UP" }).end();
});

// Middleware that transforms the raw string of req.body into json
app.use(bodyParser.json());
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

//register other security protections
app.use(helmet());
//register gzip compression
app.use(compression());

app.use("/api", routes);
/// catch 404 and forward to error handler
app.use((req, res, next) => {
  const err = new Error("Not Found");
  err.status = 404;
  next(err);
});

// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  logger(`message:${err.message || err}`);
  // Any request to this server will get here, and will send an HTTP
  const status = err.status || 500;

  logger(err);
  res.status(status).json({ status: err.message });
});

app.listen(conf.PORT, () => {
  logger(`Server has started - port ${conf.PORT}`);
});

process.on("unhandledRejection", (reason) => {
  logger(`message:${reason ? reason.message : ""} stack:${reason ? reason.stack : ""}`);
});
process.on("uncaughtException", (err) => {
  logger(`message:${err.message || err} stack:${err.stack || null}`);
});
process.on("SIGINT", () => {
  logger(`SIGINT`);
  process.exit();
});
