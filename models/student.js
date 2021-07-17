const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const reqString = {
    type: String,
    required: true
}

const studentSchema = new Schema({
    name: reqString,
    schoolId: reqString,
    strand: reqString,
    gender: reqString,
    age: Number
});

const Student = mongoose.model('Student', studentSchema);

module.exports = {
    studentSchema,
    Student
}
