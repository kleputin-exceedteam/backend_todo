const TasksController = require('./TasksController');
const express = require("express");

const router = express.Router();

router.get('/', TasksController.get);
router.delete('/delete/:id', TasksController.delete);
router.post('/add', TasksController.addItem);
router.delete('/delete_comp', TasksController.deleteComp);
router.patch('/change_status', TasksController.changeStatus);
router.patch('/change_all', TasksController.changeAll);
router.patch('/change_name', TasksController.changeName);

module.exports = router;
