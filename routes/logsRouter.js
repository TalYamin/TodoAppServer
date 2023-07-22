const express = require("express");
const router = express.Router()
const log4js = require('log4js');
const ValidationService = require("../services/validationService");
const validationService = new ValidationService();


router.get("/level", (req, res) => {
    const loggerName = req.query["logger-name"];
    const isValid = validationService.validateLoggerName(loggerName);
    if (isValid) {
        const logger = log4js.getLogger(loggerName);
        const currLoggerLevel = logger.level.levelStr;
        res.status(200).send(currLoggerLevel.toUpperCase());
    }
    else {
        res.status(409).send("Error: get logger level action is failed");
    }
});

router.put("/level", (req, res) => {
    const loggerName = req.query["logger-name"];
    const loggerLevel = req.query["logger-level"];
    const isValidLoggerName = validationService.validateLoggerName(loggerName);
    const isValidLoggerLevel = validationService.validateLoggerLevel(loggerLevel);
    if (isValidLoggerName && isValidLoggerLevel) {
        const logger = log4js.getLogger(loggerName);
        logger.level = loggerLevel;
        const currLoggerLevel = logger.level.levelStr;
        res.status(200).send(currLoggerLevel.toUpperCase());
    }
    else {
        res.status(409).send("Error: update logger level action is failed");
    }
});


module.exports = router