"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
exports.NoteSchema = new mongoose_1.Schema({
    Name: String,
    Value: String,
    Max: String,
});
exports.NoteSchema.methods.toString = function () {
    if (!this.Value)
        return '';
    if (!this.Max)
        return `${this.Name}: ${this.Value} \n`;
    else
        return `${this.Name}: ${this.Value}/${this.Max} \n`;
};
exports.Note = mongoose_1.model('Note', exports.NoteSchema);
