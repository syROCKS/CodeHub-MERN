const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const classroomSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  creator: {
    type: mongoose.Types.ObjectId,
    required: true,
    ref: 'User',
  },
  students: [
    {
      type: mongoose.Types.ObjectId,
      required: true,
      ref: 'User',
    },
  ],
  questions: [
    {
      type: mongoose.Types.ObjectId,
      required: true,
      ref: 'Question',
    },
  ],
});

classroomSchema.plugin(uniqueValidator);
classroomSchema.set('toJSON', { getters: true });

module.exports = mongoose.model('Classroom', classroomSchema);
