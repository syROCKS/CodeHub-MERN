const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const questionSchema = new mongoose.Schema({
  title: { type: String, required: true },
  body: { type: String, required: true },
  publicTCs: {
    input: { type: String, required: true },
    output: { type: String, required: true },
  },
  privateTCs: {
    input: { type: String, required: true },
    output: { type: String, required: true },
  },
  creator: {
    type: mongoose.Types.ObjectId,
    required: true,
    ref: 'User',
  },
  studentsSubmitted: [
    {
      student: {
        type: mongoose.Types.ObjectId,
        required: true,
        ref: 'User',
      },
      submissions: [
        {
          type: mongoose.Types.ObjectId,
          required: true,
          ref: 'Submission',
        },
      ],
    },
  ],
});

questionSchema.plugin(uniqueValidator);
questionSchema.set('toJSON', { getters: true });

module.exports = mongoose.model('Question', questionSchema);
