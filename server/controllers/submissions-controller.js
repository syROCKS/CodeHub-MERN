const mongoose = require('mongoose');

const Submission = require('../models/submission');
const User = require('../models/user');
const Question = require('../models/question');
const HttpError = require('../models/http-error');

// const getSubmissions = async (req, res, next) => {
//   const qid = req.params.qid;
//   const uid = req.params.uid;

//   //searching for the question
//   let question;
//   try {
//     question = await Question.findById(qid);
//   } catch (err) {
//     return next(new HttpError(err.message, 500));
//   }

//   //question not found
//   if (!question) return next(new HttpError('Question not found.', 404));

//   //searching for the student
//   let submissions;
//   question.studentsSubmitted.map((s) => {
//     if (s.student.toString() === uid.toString()) {
//       submissions = [...s.submissions];
//     }
//   });
//   res.status(200).json({submissions});
// };

const getSubmissions = async (req, res, next) => {
  const qid = req.params.qid;

  //searching for the question
  let question;
  try {
    question = await Question.findById(qid).populate('studentsSubmitted.student').populate('studentsSubmitted.submissions');
  } catch (err) {
    return next(new HttpError(err.message, 500));
  }

  //question not found
  if (!question) return next(new HttpError('Question not found.', 404));

  //searching for the student
  // let submissions;
  // question.studentsSubmitted.map((s) => {
  //   submissions = [...s.submissions];
  // });
  res.status(200).json({ question });
};

const newSubmission = async (req, res, next) => {
  const qid = req.params.qid;
  const status = req.body.status;
  const sourceCode = req.body.sourceCode;
  const uid = req.userData.userId;

  //creating new submission
  const submission = new Submission({
    sourceCode,
    status,
    question: qid,
    submittedBy: uid,
  });

  //searching for the question
  let question;
  try {
    question = await Question.findById(qid);
  } catch (err) {
    return next(new HttpError(err.message, 500));
  }

  //question not found
  if (!question) return next(new HttpError('Question not found.', 404));

  //saving new submission
  try {
    let found = false;
    const sess = await mongoose.startSession();
    sess.startTransaction();
    //searching for the student submission's array
    question.studentsSubmitted.map((s) => {
      if (s.student.toString() === uid.toString()) {
        found = true;
        s.submissions.push(submission);
      }
    });
    //user is submitting for the first time
    if (!found)
      question.studentsSubmitted.push({
        student: uid,
        submissions: [submission],
      });
    await question.save();
    await submission.save();
    await sess.commitTransaction();
  } catch (err) {
    return next(
      new HttpError(
        err.message || 'Submission failed, please try again later.',
        500
      )
    );
  }
  res.status(201).json({ submission });
};

exports.getSubmissions = getSubmissions;
exports.newSubmission = newSubmission;
