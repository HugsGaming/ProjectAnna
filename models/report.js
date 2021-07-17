const mongoose = require('mongoose');
const studentModel = require('./student');
const studentSchema = studentModel.studentSchema;

const Schema = mongoose.Schema;

const reportSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    student: studentSchema
}, {timestamps: true});

const Report = mongoose.model('Report', reportSchema);
module.exports = Report;
