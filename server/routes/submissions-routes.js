const express = require('express');

const submissionsController = require('../controllers/submissions-controller');
const checkAuth = require('../middleware/check-auth');

const router = express.Router();

router.use(checkAuth);

// router.get('/:qid/:uid',submissionsController.getSubmissions);

router.get('/:qid',submissionsController.getSubmissions);

router.post('/new/:qid',submissionsController.newSubmission);

module.exports = router;