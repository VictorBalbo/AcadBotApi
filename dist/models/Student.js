"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const StudentSchema = new mongoose_1.Schema({
    Name: String,
    BlipIdentity: String,
    AcadUser: String,
    AcadPassword: String,
});
StudentSchema.pre('save', function (next) {
    this.AcadUser = Buffer.from(this.AcadUser).toString('base64');
    this.AcadPassword = Buffer.from(this.AcadPassword).toString('base64');
    next();
});
StudentSchema.post('find', function () {
    this.AcadUser = Buffer.from(this.AcadUser, 'base64').toString();
    this.AcadPassword = Buffer.from(this.AcadPassword, 'base64').toString();
});
exports.Student = mongoose_1.model('Student', StudentSchema);
