const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../models/user');
const Classroom = require('../models/classroom');
const HttpError = require('../models/http-error');

const getUsers = async (req, res, next) => {
  const cid = req.params.cid;

  //searching for the classroom
  let classroom;
  try {
    classroom = await Classroom.findById(cid).populate('students');
  } catch (err) {
    return next(
      new HttpError('Something went wrong, please try again later.', 500)
    );
  }

  //classroom not found
  if (!classroom)
    return next(
      new HttpError('Cannot find any classroom with the mentioned id.', 404)
    );

  //mapping name of all the students
  const students = classroom.students.map((student) => {
    return { name: student.name };
  });

  res.json({ students: students });
};

//TODO: implement getProgress
const getProgress = (req, res, next) => {
  res.json({
    message: `Submissions of the user for question ${req.params.qid}`,
  });
};

const signup = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log(errors);
    return next(
      new HttpError('Invalid inputs passed, please check your data.', 422)
    );
  }
  const { name, email, password } = req.body;
  let existingUser;

  //checking for existing user
  try {
    existingUser = await User.findOne({ email });
  } catch (err) {
    return next(
      new HttpError('Signing up failed, please try again later.', 500)
    );
  }
  if (existingUser)
    return next(
      new HttpError('Could not create user, email already exists.', 422)
    );

  //hashing password
  let hashedPassword;
  try {
    hashedPassword = await bcrypt.hash(password, 12);
  } catch (err) {
    const error = new HttpError('Could not hash user, please try again.', 500);
    return next(error);
  }

  //creating new user
  const user = new User({
    name,
    email,
    password: hashedPassword,
    isTeacher: false,
    questions: [],
  });

  //saving new user
  try {
    await user.save();
  } catch (err) {
    return next(
      new HttpError('Signing up failed, please try again later.', 500)
    );
  }

  let token;
  try {
    token = jwt.sign(
      { userId: user.id, email: user.email },
      'supersecret_dont_share',
      { expiresIn: '4h' }
    );
  } catch (err) {
    const error = new HttpError(
      'Signing up failed, please try again later.',
      500
    );
    return next(error);
  }

  res.status(201).json({ userId: user.id, email: user.email, token: token });
};

const login = async (req, res, next) => {
  const { email, password } = req.body;

  //checking for the user via email
  let user;
  try {
    user = await User.findOne({ email });
  } catch (error) {
    return next(new HttpError('Something went wrong.', 500));
  }
  if (!user)
    return next(
      new HttpError(
        'Could not identify the user, credentials seem to be wrong.',
        403
      )
    );

  //validating password
  let isValidPassword;
  try {
    isValidPassword = await bcrypt.compare(password, user.password);
  } catch (err) {
    const error = new HttpError(
      'Could not log you in, please check your credentials and try again.',
      500
    );
    return next(error);
  }

  if (!isValidPassword) {
    const error = new HttpError(
      'Invalid credentials, could not log you in.',
      403
    );
    return next(error);
  }

  let token;
  try {
    token = jwt.sign(
      { userId: user.id, email: user.email },
      'supersecret_dont_share',
      { expiresIn: '4h' }
    );
  } catch (err) {
    const error = new HttpError(
      'Logging in failed, please try again later.',
      500
    );
    return next(error);
  }
  // console.log(user);
  res.json({
    userId: user.id,
    email: user.email,
    token: token,
    isTeacher: user.isTeacher,
  });
};

exports.getUsers = getUsers;
exports.getProgress = getProgress;
exports.signup = signup;
exports.login = login;
