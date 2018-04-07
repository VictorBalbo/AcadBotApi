"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const server_1 = require("./server");
const SigClient_1 = require("./Clients/SigClient");
const Student_1 = require("./Models/Student");
const server = new server_1.Server();
server.start();
Student_1.Student.find((err, students) => {
    if (!students)
        return;
    students.forEach((student) => __awaiter(this, void 0, void 0, function* () {
        const client = new SigClient_1.default(student.AcadUser, student.AcadPassword, student.BlipIdentity);
        yield client.FetchNotes();
    }));
});
