const generateId = require('../helpers/idGenerator.js');
const Status = require('../models/status.js');
const Filter = require('../models/filter.js');
const SortBy = require('../models/sortBy.js');



const todos = [];

class todoService {

    createNewTodo(todoInfo) {
        let newTodo = {
            id: generateId(),
            title: todoInfo.title,
            content: todoInfo.content,
            status: Status.PENDING,
            dueDate: todoInfo.dueDate
        };
        todos.push(newTodo);
        return newTodo.id;
    }

    verifyIfTodoIsExistByTitle(todoTitle) {
        let isExist = false;
        const todoToFind = todos.find(currTodo => currTodo.title === todoTitle);
        if (todoToFind !== undefined) {
            isExist = true;
        }
        return isExist;
    }

    verifyIfTodoIsExistByID(todoId) {
        let isExist = false;
        const todoToFind = todos.find(currTodo => currTodo.id === todoId);
        if (todoToFind !== undefined) {
            isExist = true;
        }
        return isExist;
    }

    verifyIsValidDate(todoDate) {
        let isValid = true;
        const currentTimestamp = Date.now();
        if (currentTimestamp > todoDate) {
            isValid = false;
        }
        return isValid;
    }

    getStatusByTodoId(todoId){
        const todoToFind = todos.find(currTodo => currTodo.id === todoId);
        return todoToFind.status;
    }

    getAllTodosByFilter(filter) {
        let filteredTodos;
        if (filter === Filter.ALL) {
            filteredTodos = todos;
        } else {
            filteredTodos = todos.filter(todo => todo.status === filter);
        }
        return filteredTodos;
    }

    countTodoByFilter(filter) {
        let size = 0;
        const filteredTodos = this.getAllTodosByFilter(filter);
        size = filteredTodos.length;
        return size;
    }

    sortTodosBy(todosToSort, sortBy) {
        let sortedTodos = [];
        switch (sortBy) {
            case SortBy.UNDEFINED:
            case SortBy.ID:
                sortedTodos = todosToSort.sort((a, b) => a.id - b.id);
                break;
            case SortBy.DUE_DATE:
                sortedTodos = todosToSort.sort((a, b) => a.dueDate - b.dueDate);
                break;
            case SortBy.TITLE:
                sortedTodos = todosToSort.sort((a, b) => a.title.localeCompare(b.title));
                break;
            default:
                break;
        }
        return sortedTodos;
    }

    updateTodoStatusById(todoId, statusToUpdate){
        const indexToUpdate = todos.findIndex(currTodo => currTodo.id === todoId);

        if (indexToUpdate !== -1) {
            todos[indexToUpdate].status = statusToUpdate;
        }
    }

    deleteTodoById(todoId){
        const indexToRemove = todos.findIndex(currTodo => currTodo.id === todoId);
        if (indexToRemove !== -1) {
            todos.splice(indexToRemove, 1)
        }
        return todos.length;
    }

    getNumOfTodos(){
        return todos.length;
    }
}

module.exports = todoService;
