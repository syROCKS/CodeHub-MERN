const mongoose = require('mongoose');

const Classroom = require('../models/classroom');
const User = require('../models/user');
const HttpError = require('../models/http-error');

const getClassrooms = async (req, res, next) => {
  //searching for the user
  let user;
  try {
    user = await User.findById(req.userData.userId).populate('classrooms');
  } catch (error) {
    return next(
      new HttpError('Creating classroom failed, please try again later.', 500)
    );
  }

  //user not found
  if (!user)
    return next(new HttpError('Could not find user for provided id.', 404));

  const joinedClassrooms = user.classrooms.map((classroom) => {
    return { id: classroom._id, name: classroom.name };
  });
  res.json({ classrooms: joinedClassrooms });
};

const getClassroom = async (req, res, next) => {
  const cid = req.params.cid;
  let classroom;

  //searching for the classroom
  try {
    classroom = await Classroom.findById(cid)
      .populate('creator')
      .populate('questions')
      .populate('students');
  } catch (err) {
    return next(
      new HttpError('Fetching classroom failed, please try again.', 500)
    );
  }

  //classroom not found
  if (!classroom)
    return next(new HttpError('Could not find a classroom for that id. ', 404));

  res.status(201).json({ classroom: classroom });
};

const newClassroom = async (req, res, next) => {
  // console.log(req.body);
  const name = req.body.name;
  //creating new classroom
  const classroom = new Classroom({
    name,
    creator: req.userData.userId,
    students: [],
    questions: [],
  });

  //searching for the user
  let user;
  try {
    user = await User.findById(req.userData.userId);
  } catch (error) {
    return next(
      new HttpError('Creating classroom failed, please try again later.', 500)
    );
  }

  //user not found
  if (!user)
    return next(new HttpError('Could not find user for provided id.', 404));

  //save the classroom and update the user(classroom)
  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();
    await classroom.save({ session: sess });
    user.classrooms.push(classroom);
    await user.save({ session: sess });
    await sess.commitTransaction();
  } catch (err) {
    return next(new HttpError(err.message, 500));
  }

  res.status(201).json({ classroom });
};

const joinClassroom = async (req, res, next) => {
  const cid = req.params.cid;
  let classroom;

  //searching for the classroom
  try {
    classroom = await Classroom.findById(cid);
  } catch (err) {
    return next(
      new HttpError('Deleting classroom failed, please try again.', 500)
    );
  }

  //classroom not found
  if (!classroom)
    return next(new HttpError('Could not find a classroom for that id. ', 404));

  //searching for the user
  //TODO: Limit any teacher account to join the classroom
  let user;
  try {
    user = await User.findById(req.userData.userId);
  } catch (error) {
    return next(
      new HttpError('Creating classroom failed, please try again later.', 500)
    );
  }

  //user not found
  if (!user)
    return next(new HttpError('Could not find user for provided id.', 404));

  //check if the classroom is already joined.
  const alreadyJoinedClassroom = user.classrooms.find((classroom) => {
    return classroom.toString() === cid;
  });

  if (alreadyJoinedClassroom)
    return next(new HttpError('Classroom already joined!', 500));

  //update classroom(students) and user(classrooms)
  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();
    classroom.students.push(user);
    await classroom.save({ session: sess });
    user.classrooms.push(classroom);
    await user.save({ session: sess });
    await sess.commitTransaction();
  } catch (err) {
    return next(
      new HttpError('Something went wrong, could not join classroom.', 500)
    );
  }
  res.status(200).json({ message: 'JOINED classroom' });
};

const deleteClassroom = async (req, res, next) => {
  const cid = req.params.cid;
  let classroom;

  //searching for the classroom
  try {
    classroom = await Classroom.findById(cid)
      .populate('creator')
      .populate('students');
  } catch (err) {
    return next(
      new HttpError('Deleting classroom failed, please try again.', 500)
    );
  }

  //classroom not found
  if (!classroom)
    return next(new HttpError('Could not find a classroom for that id. ', 404));

  // console.log(classroom);
  // return;

  //user is not the creator of the classroom
  if (classroom.creator.id !== req.userData.userId)
    return next(
      new HttpError('You are not authorized to delete this classroom.', 401)
    );

  //delete classroom and update user(classrooms)
  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();
    //deleting classroom for the creator
    classroom.creator.classrooms.pull(classroom);
    await classroom.creator.save({ session: sess });
    //deleting classroom for all the students
    classroom.students.map(async (student) => {
      student.classrooms.pull(classroom);
      await student.save({ session: sess });
    });
    await classroom.remove({ session: sess });
    await sess.commitTransaction();
  } catch (err) {
    return next(
      new HttpError('Something went wrong, could not delete classroom.', 500)
    );
  }
  res.status(200).json({ message: 'DELETED classroom' });
};

exports.getClassrooms = getClassrooms;
exports.getClassroom = getClassroom;
exports.newClassroom = newClassroom;
exports.joinClassroom = joinClassroom;
exports.deleteClassroom = deleteClassroom;
