"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const Note_1 = require("./Note");
const LessonSchema = new mongoose_1.Schema({
    Name: String,
    Notes: [Note_1.NoteSchema],
    StudentIdentity: String,
});
LessonSchema.methods.toString = function () {
    let lessonString = `${this.Name} \n`;
    if (this.Notes.length === 0)
        return lessonString + 'Sem notas';
    this.Notes.forEach((note) => {
        lessonString += note.toString();
    });
    return lessonString;
};
exports.Lesson = mongoose_1.model('Lesson', LessonSchema);
