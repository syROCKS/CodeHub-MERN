const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const submissionSchema = new mongoose.Schema({
  sourceCode: {type: String, required: true},
  status: { type: String, required: true },
  question: {
    type: mongoose.Types.ObjectId,
    required: true,
    ref: 'Question',
  },
  submittedBy: {
    type: mongoose.Types.ObjectId,
    required: true,
    ref: 'User',
  },
});

submissionSchema.plugin(uniqueValidator);
submissionSchema.set('toJSON', { getters: true });

module.exports = mongoose.model('Submission', submissionSchema);
