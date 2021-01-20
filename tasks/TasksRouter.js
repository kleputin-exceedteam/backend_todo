const TasksController = require('./TasksController');
const express = require("express");
const auth = require('../Authentication/middleware.auth');

const router = express.Router();

router.get('/', auth, TasksController.get);
router.delete('/delete/:id', auth, TasksController.delete);
router.post('/add', auth, TasksController.addItem);
router.delete('/delete_comp', auth, TasksController.deleteComp);
router.patch('/change_status', auth, TasksController.changeStatus);
router.patch('/change_all', auth, TasksController.changeAll);
router.patch('/change_name', auth, TasksController.changeName);

module.exports = router;
