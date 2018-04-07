"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const LessonController_1 = require("../controllers/LessonController");
const StudentController_1 = require("../Controllers/StudentController");
exports.Route = (app) => {
    app.route('/lessons').get(LessonController_1.ListLessons);
    app.route('/lessons/:studentIdentity').get(LessonController_1.GetLessonByStudent);
    app
        .route('/students')
        .get(StudentController_1.ListStudents)
        .post(StudentController_1.CreateStudent);
    app.route('/students/:studentIdentity').get(StudentController_1.GetStudent);
    app.use(function (req, res) {
        res.status(404).send({ url: req.originalUrl + ' not found' });
    });
};
