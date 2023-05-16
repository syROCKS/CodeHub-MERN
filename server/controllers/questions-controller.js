const mongoose = require('mongoose');

const Classroom = require('../models/classroom');
const Question = require('../models/question');
const HttpError = require('../models/http-error');

const getQuestions = async (req, res, next) => {
  const cid = req.params.cid;

  //searching for the classroom
  let classroom;
  try {
    classroom = await Classroom.findById(cid).populate('questions');
  } catch (err) {
    return next(
      new HttpError('Something went wrong, please try again later.', 500)
    );
  }

  //classroom not found
  if (!classroom) return next(new HttpError('Classroom not found.', 404));

  const questions = classroom.questions.map((q) => {
    return { id: q.id, title: q.title };
  });
  res.status(200).json({ questions });
};

const getQuestion = async (req, res, next) => {
  const qid = req.params.qid;

  //searching for the classroom
  let question;
  try {
    question = await Question.findById(qid);
  } catch (err) {
    return next(
      new HttpError('Something went wrong, please try again later.', 500)
    );
  }

  //classroom not found
  if (!question) return next(new HttpError('Question not found.', 404));
  // console.log(question);
  res.status(200).json({ question });
};

const newQuestion = async (req, res, next) => {
  const cid = req.params.cid;
  const { title, body, publicTCInputs, publicTCOutputs, privateTCInputs, privateTCOutputs } = req.body;

  //creating new question
  const question = new Question({
    title,
    body,
    publicTCs: {input: publicTCInputs, output: publicTCOutputs},
    privateTCs: {input: privateTCInputs, output: privateTCOutputs},
    creator: req.userData.userId,
    studentsSubmitted: [],
  });

  // console.log(question);

  //searching for the classroom
  let classroom;
  try {
    classroom = await Classroom.findById(cid);
  } catch (err) {
    return next(
      new HttpError('Something went wrong, please try again later.', 500)
    );
  }

  //classroom not found
  if (!classroom) return next(new HttpError('Classroom not found.', 404));

  //saving new question and updating classroom(questions)
  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();
    classroom.questions.push(question);
    await classroom.save({ session: sess });
    await question.save({ session: sess });
    await sess.commitTransaction();
  } catch (err) {
    return next(
      new HttpError(err.message || 'Failed to save the question, please try again later.', 500)
    );
  }
  res.status(201).json({ question });
};

exports.getQuestions = getQuestions;
exports.getQuestion = getQuestion;
exports.newQuestion = newQuestion;
