const express = require('express');

const classroomsController = require('../controllers/classrooms-controller');
const checkAuth = require('../middleware/check-auth');

const router = express.Router();

router.use(checkAuth);

router.get('/',classroomsController.getClassrooms);

router.get('/:cid',classroomsController.getClassroom);

router.post('/new',classroomsController.newClassroom);

router.post('/join/:cid',classroomsController.joinClassroom);

router.delete('/:cid',classroomsController.deleteClassroom);

module.exports = router;