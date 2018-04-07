"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const bodyParser = require("body-parser");
const Route_1 = require("./Routes/Route");
const app = express();
const mongoose = require('mongoose');
const port = process.env.PORT || 3000;
class Server {
    constructor() {
        mongoose.Promise = global.Promise;
        mongoose.connect('mongodb://localhost/Acadbot');
        app.use(bodyParser.urlencoded({ extended: true }));
        app.use(bodyParser.json());
    }
    start() {
        Route_1.Route(app);
        app.listen(port, () => {
            console.log('API server started on: ' + port);
        });
    }
}
exports.Server = Server;
