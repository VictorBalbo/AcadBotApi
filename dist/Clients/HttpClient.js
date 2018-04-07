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
const Request = require("request-promise-native");
const he = require("he"); // Decode html
class HttpClient {
    constructor(cookieJar) {
        this.cookieJar = cookieJar || Request.jar();
    }
    SendRequest(uri, form) {
        return __awaiter(this, void 0, void 0, function* () {
            const options = {
                method: 'POST',
                uri,
                form,
                followAllRedirects: true,
                headers: {
                    'User-Agent': 
                    // tslint:disable-next-line:max-line-length
                    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/63.0.3239.84 Safari/537.36',
                },
                jar: this.cookieJar,
            };
            return Request(options);
        });
    }
    Post(uri, body, headers = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            const options = {
                method: 'POST',
                uri,
                body,
                json: true,
                headers,
            };
            return Request(options);
        });
    }
    DecodeHtml(text) {
        return he.decode(text);
    }
}
exports.HttpClient = HttpClient;
