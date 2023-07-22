const express = require("express");
const router = express.Router()
const TodoService = require("../services/todoService");
const todoService = new TodoService();
const ValidationService = require("../services/validationService");
const validationService = new ValidationService();
const {todoLogger} = require('../log4js.js')
const SortBy = require("../models/sortBy");

router.get("/health", (req, res) => {
    res.status(200).send("OK");
});

router.post("/", (req, res) => {
    const todoInfo = req.body;
    const isExist = todoService.verifyIfTodoIsExistByTitle(todoInfo.title);
    const isValidDate = todoService.verifyIsValidDate(todoInfo.dueDate);
    if (!isExist && isValidDate) {
        const numOfTodosBefore = todoService.getNumOfTodos();
        const newId = todoService.createNewTodo(todoInfo);
        todoLogger.info(`Creating new TODO with Title [${todoInfo.title}]`)
        todoLogger.debug(`Currently there are ${numOfTodosBefore} TODOs in the system. New TODO will be assigned with id ${newId}`)
        res.status(200).send({ result: newId });
    }
    else if (isExist) {
        todoLogger.error(`Error: TODO with the title [${todoInfo.title}] already exists in the system`)
        res.status(409).send({ errorMessage: `Error: TODO with the title [${todoInfo.title}] already exists in the system` });
    } else if (!isValidDate) {
        todoLogger.error(`Error: Can't create new TODO that its due date is in the past`)
        res.status(409).send({ errorMessage: "Error: Can't create new TODO that its due date is in the past" });
    }
});


router.get("/size", (req, res) => {
    const filter = req.query.status;
    const isValid = validationService.validateFilter(filter);
    if (isValid) {
        const size = todoService.countTodoByFilter(filter);
        todoLogger.info(`Total TODOs count for state ${filter} is ${size}`)
        res.status(200).send({ result: size });
    }
    else {
        res.sendStatus(400);
    }
});


router.get("/content", (req, res) => {

    const filter = req.query.status;
    const sortBy = req.query.sortBy;

    const isValidFilter = validationService.validateFilter(filter);
    const isValidSortBy = validationService.validateSortBy(sortBy);

    if (isValidFilter && isValidSortBy) {
        const filteredTodos = todoService.getAllTodosByFilter(filter);
        const sortedTodos = todoService.sortTodosBy(filteredTodos, sortBy);
        const totalTodos = todoService.getNumOfTodos();
        const sortField = sortBy === undefined ? SortBy.ID : sortBy;
        todoLogger.info(`Extracting todos content. Filter: ${filter} | Sorting by: ${sortField}`);
        todoLogger.debug(`There are a total of ${totalTodos} todos in the system. The result holds ${sortedTodos.length} todos`);
        res.status(200).send({result: sortedTodos});
    }
    else {
        res.sendStatus(400);
    }

});

router.put("/", (req, res) => {
    const todoId = Number(req.query.id);
    const statusToUpdate = req.query.status;

    const isExist = todoService.verifyIfTodoIsExistByID(todoId);
    const isValidStatus = validationService.validateStatus(statusToUpdate);

    if(isValidStatus){
    todoLogger.info(`Update TODO id [${todoId}] state to ${statusToUpdate}`);
    }
    
    if (isExist && isValidStatus) {
        const oldStatus = todoService.getStatusByTodoId(todoId);
        todoService.updateTodoStatusById(todoId, statusToUpdate);
        todoLogger.debug(`Todo id [${todoId}] state change: ${oldStatus} --> ${statusToUpdate}`)
        res.status(200).send({ result: oldStatus });
    } else if (!isExist) {
        todoLogger.error(`Error: no such TODO with id ${req.query.id}`)
        res.status(404).send({ errorMessage: `Error: no such TODO with id ${req.query.id}` });
    } else if (!isValidStatus) {
        res.sendStatus(400);
    }
});


router.delete("/", (req, res) => {
    const todoId = Number(req.query.id);
    const isExist = todoService.verifyIfTodoIsExistByID(todoId);
    
    if (isExist) {
        const newSize = todoService.deleteTodoById(todoId);
        todoLogger.info(`Removing todo id ${todoId}`)
        todoLogger.debug(`After removing todo id [${todoId}] there are ${newSize} TODOs in the system`)
        res.status(200).send({ result: newSize });
    } else if (!isExist) {
        todoLogger.error(`Error: no such TODO with id ${req.query.id}`)
        res.status(404).send({ errorMessage: `Error: no such TODO with id ${req.query.id}` });
    }
});

module.exports = router