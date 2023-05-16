const express = require('express');

const questionsController = require('../controllers/questions-controller');
const checkAuth = require('../middleware/check-auth');

const router = express.Router();

router.use(checkAuth);

router.get('/:cid',questionsController.getQuestions);

router.get('/question/:qid',questionsController.getQuestion);

router.post('/new/:cid',questionsController.newQuestion);

module.exports = router;