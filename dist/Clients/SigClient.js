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
const cheerio_1 = require("cheerio");
const httpClient_1 = require("./httpClient");
const Note_1 = require("../Models/Note");
const Lesson_1 = require("../Models/Lesson");
const DISCENTE_URL = 'https://sig.cefetmg.br/sigaa/portais/discente/discente.jsf';
const INDEX_URL = 'https://sig.cefetmg.br/sigaa/ava/index.jsf';
const LOGIN_URL = 'https://sig.cefetmg.br/sigaa/logar.do?dispatch=logOn';
class AcadClient {
    /**
     * Creates an instance of AcadClient.
     * @param {string} acadUser User login in Acad system
     * @param {string} acadPassword User password in Acad system
     * @param {string} blipIdentity User identity on blip
     * @memberof AcadClient
     */
    constructor(acadUser, acadPassword, blipIdentity) {
        this.httpClient = new httpClient_1.HttpClient();
        this.AcadUser = acadUser;
        this.AcadPassword = acadPassword;
        this.BlipIdentity = blipIdentity;
    }
    /**
     * Fetch for notes on Acad using the credentials passed
     * @memberof SigClient
     */
    FetchNotes() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.Login(this.AcadUser, this.AcadPassword);
            const homePage = yield this.DismissNotification();
            yield this.OpenLessons(homePage);
        });
    }
    Login(user, password) {
        return __awaiter(this, void 0, void 0, function* () {
            const formData = {
                'user.login': user,
                'user.senha': password,
                width: '1536',
                height: '864',
                urlRedirect: '',
                subsistemaRedirect: '',
                acao: '',
                acessibilidade: '',
            };
            return this.httpClient.SendRequest(LOGIN_URL, formData);
        });
    }
    DismissNotification() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.httpClient.SendRequest(DISCENTE_URL);
        });
    }
    OpenLessons(homePage) {
        return __awaiter(this, void 0, void 0, function* () {
            const lessonsRequests = this.MountLessonsRequests(homePage);
            if (lessonsRequests.length === 0) {
                throw Error('Epa, não tem materia nenhuma D:');
            }
            console.log(`Tem ${lessonsRequests.length} materias`);
            for (let i = 0; i < lessonsRequests.length; i++) {
                const lessonPage = yield this.httpClient.SendRequest(DISCENTE_URL, lessonsRequests[i]);
                const notesRequest = this.MountNotesRequest(lessonPage);
                const notesPage = yield this.httpClient.SendRequest(INDEX_URL, notesRequest);
                this.ParseNotes(notesPage, this.GetLessonName(lessonPage));
            }
        });
    }
    MountLessonsRequests(homePage) {
        const $ = cheerio_1.load(homePage);
        const formList = $('form[id^=form_acessarTurmaVirtual]').toArray();
        const formData = [];
        formList.map(element => {
            const lesson = {};
            element.children.map(child => {
                if (child.tagName === 'input') {
                    lesson[child.attribs.name] = child.attribs.value;
                }
                else if (child.tagName === 'a') {
                    lesson[child.attribs.id] = child.attribs.id;
                }
            });
            formData.push(lesson);
        });
        return formData;
    }
    MountNotesRequest(lessonPage) {
        const $ = cheerio_1.load(lessonPage);
        return {
            formMenu: 'formMenu',
            'formMenu:j_id_jsp_311393315_46': 'formMenu:j_id_jsp_311393315_67',
            'formMenu:j_id_jsp_311393315_72': 'formMenu:j_id_jsp_311393315_72',
            'javax.faces.ViewState': $('#javax\\.faces\\.ViewState').attr('value'),
        };
    }
    GetLessonName(lessonPage) {
        const $ = cheerio_1.load(lessonPage);
        return $('#linkNomeTurma').text();
    }
    ParseNotes(notesPage, lessonName) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(`Parsing ${lessonName}`);
            let lesson = yield Lesson_1.Lesson.findOne({ Name: lessonName, StudentIdentity: this.BlipIdentity }).exec();
            if (!lesson)
                lesson = new Lesson_1.Lesson({ Name: lessonName, StudentIdentity: this.BlipIdentity });
            const $ = cheerio_1.load(notesPage);
            // Get header row with test data
            const headers = $('tr#trAval *').toArray();
            if (!headers) {
                console.log(lesson);
                return;
            }
            // Get line with notes
            const cell = $('tr.linhaPar td').toArray();
            let i = 0;
            let note;
            headers.map((header) => {
                if (header.tagName === 'th') {
                    i++;
                    if (note) {
                        lesson.Notes.push(note);
                    }
                    if (header.attribs.id) {
                        // Note
                        note = new Note_1.Note({
                            Value: cell[i - 1].children[0].data.replace(/\t|\n/g, ''),
                        });
                        note.Name = header.children[0].data || '';
                        return;
                    }
                    else {
                        note = undefined;
                    }
                }
                else if (header.attribs.id.startsWith('den')) {
                    // Input with test name
                    note.Name = this.httpClient.DecodeHtml(header.attribs.value);
                }
                else if (header.attribs.id.startsWith('nota')) {
                    // Input with test value
                    note.Max = header.attribs.value;
                }
            });
            if (lesson.isModified()) {
                this.notifyUser(lesson);
                lesson.save();
            }
        });
    }
    notifyUser(lesson) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.httpClient.Post('https://msging.net/messages', {
                to: lesson.StudentIdentity,
                type: 'text/plain',
                content: lesson.toString(),
            });
        });
    }
}
exports.default = AcadClient;
