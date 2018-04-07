"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Lesson_1 = require("../Models/Lesson");
exports.ListLessons = (request, response) => {
    Lesson_1.Lesson.find({}, (error, lesson) => {
        if (error)
            response.send(error);
        response.json(lesson);
    });
};
exports.GetLessonByStudent = (request, response) => {
    Lesson_1.Lesson.find({ StudentIdentity: request.params.studentIdentity }, (error, lesson) => {
        if (error)
            response.send(error);
        response.json(lesson);
    });
};
