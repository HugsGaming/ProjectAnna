const express = require('express');
const StudentModel = require('../models/student.js');
const Report = require('../models/report');
const Student = StudentModel.Student;

const router = express.Router();

router.get('/create', (req, res) => {
    Student.find().then(result => {
        res.render('./reports/createreport', {title: 'Create a Report', students: result});
    }).catch(err => console.error(err));
});

router.get('/', (req, res) => {
    Report.find().then(result => {
        res.render('./reports', {title: 'Reports', reports: result});
    }).catch(err => console.error(err));
});

router.post('/', (req, res) => {
    Student.findById(req.body.student).then(result => {
        req.body.student = result;
    }).then(result => {
        const report = new Report(req.body);
        console.log(req.body);
        report.save().then(result => {
            res.redirect('/reports');
        }).catch(err => console.error(err));
    });
});

router.get('/:id', (req, res) => {
    const id = req.params.id;
    Report.findById(id).then(result => {
        res.render('./reports/detail', {title: result.title, report: result})
    }).catch(err => console.error(err))
});

module.exports = router;
