"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.waitForCode = void 0;
var spotify_service_1 = __importDefault(require("./spotify.service"));
var express_1 = __importDefault(require("express"));
require("dotenv/config");
var env_smart_1 = __importDefault(require("env-smart"));
var constants_1 = require("./constants");
env_smart_1.default.load({ directory: constants_1.envDirectory });
var AUTH_SERVER_PORT = process.env.PORT || process.env.AUTH_SERVER_PORT;
exports.waitForCode = function (onCodeReceived) {
    var app = express_1.default();
    var port = AUTH_SERVER_PORT;
    var server = app.listen(port, function () {
        return console.log("Auth server is listening on " + port);
    });
    app.get('/', function (req, res) {
        var spotifyService = new spotify_service_1.default();
        var authURL = spotifyService.getAuthorizationUrl();
        res.redirect(authURL);
    });
    app.get('/spotifyAuth', function (req, res) {
        res.send('Authorization received, you can close this window now.');
        server.close();
        onCodeReceived(req.query.code);
    });
};
