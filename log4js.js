const log4js = require('log4js');

log4js.configure({
  appenders: {
    requestsFile: { 
      type: 'file', 
      filename: 'logs/requests.log',
      layout: {
        type: 'pattern',
        pattern: '%d{dd-MM-yyyy hh:mm:ss.SSS} %p: %m | request #%X{requestNumber}',
      },
      mode: 0o666,
      flags: "w"
    },
    todosFile: { 
      type: 'file',
      filename: 'logs/todos.log',
      layout: {
        type: 'pattern',
        pattern: '%d{dd-MM-yyyy hh:mm:ss.SSS} %p: %m | request #%X{requestNumber}',
      },
      mode: 0o666,
      flags: "w"
    },
    console: { 
      type: 'console',
      layout: {
        type: 'pattern',
        pattern: '%d{dd-MM-yyyy hh:mm:ss.SSS} %p: %m | request #%X{requestNumber}'
      }
    }
  },
  categories: {
    default: { appenders: ['console'], level: 'info' },
    'request-logger': { appenders: ['console', 'requestsFile'], level: 'info' },
    'todo-logger': { appenders: ['todosFile'], level: 'info' }
  }
});

const requestLogger = log4js.getLogger('request-logger');
const todoLogger = log4js.getLogger('todo-logger');

module.exports = {
  requestLogger,
  todoLogger
};