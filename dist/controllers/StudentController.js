"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Student_1 = require("../Models/Student");
exports.ListStudents = (request, response) => {
    Student_1.Student.find({}, (error, student) => {
        if (error)
            response.send(error);
        response.json(student);
    });
};
exports.CreateStudent = (request, response) => {
    const new_student = new Student_1.Student(request.body);
    new_student.save(function (error, student) {
        if (student)
            response.send(error);
        response.json(student);
    });
};
exports.GetStudent = (request, response) => {
    Student_1.Student.find({ BlipIdentity: request.params.studentIdentity }, (error, student) => {
        if (error)
            response.send(error);
        response.json(student);
    });
};
