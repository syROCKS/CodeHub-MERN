const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true, minLength: 6 },
  isTeacher: { type: Boolean, required: true },
  classrooms: [{ type: mongoose.Types.ObjectId, required: true, ref: 'Classroom' }],
})

userSchema.plugin(uniqueValidator)
userSchema.set('toJSON', { getters: true})

module.exports = mongoose.model('User', userSchema)
