const express = require("express");
const app = express();
const port = 9583;
const bodyParser = require("body-parser");
const todoRouter = require('./routes/todoRouter')
const { requestLogger, todoLogger } = require('./log4js.js')
const logsRouter = require('./routes/logsRouter')
const {increaseRequestCounter ,decreaseRequestCounter } = require('./helpers/requestCounter.js');


app.use(
  bodyParser.json({
    type() {
      return true;
    },
  })
);

app.use((req, res, next) => {
  const start = Date.now();
  req.requestNumber = increaseRequestCounter();
  todoLogger.addContext('requestNumber', req.requestNumber);
  requestLogger.addContext('requestNumber', req.requestNumber);
  const reqPath = req.path;
  next();
  res.on("finish", () => {
    if (res.statusCode !== 400) {
      requestLogger.info(`Incoming request | #${req.requestNumber} | resource: ${reqPath} | HTTP Verb ${req.method}`);
      const duration = Date.now() - start;
      req.duration = duration;
      requestLogger.debug(`request #${req.requestNumber} duration: ${duration}ms`);
    } else {
      req.requestNumber = decreaseRequestCounter();
      todoLogger.addContext('requestNumber', req.requestNumber);
      requestLogger.addContext('requestNumber', req.requestNumber);
    }
  });
});

app.use("/todo", todoRouter);

app.use("/logs", logsRouter);

app.listen(port, () => {
   console.log(`Server listening on port ${port}...\n`);
});
