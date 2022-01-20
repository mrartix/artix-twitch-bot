"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var spotify_web_api_node_1 = __importDefault(require("spotify-web-api-node"));
var auth_server_1 = require("./auth-server");
require("dotenv/config");
var spotify_auth_1 = __importDefault(require("./spotify-auth"));
var fs_1 = __importDefault(require("fs"));
var env_smart_1 = __importDefault(require("env-smart"));
var constants_1 = require("./constants");
env_smart_1.default.load({ directory: constants_1.envDirectory });
var _a = process.env, SPOTIFY_CLIENT_ID = _a.SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET = _a.SPOTIFY_CLIENT_SECRET, AUTH_SERVER_PORT = _a.AUTH_SERVER_PORT, ADD_TO_QUEUE = _a.ADD_TO_QUEUE, ADD_TO_PLAYLIST = _a.ADD_TO_PLAYLIST, SPOTIFY_PLAYLIST_ID = _a.SPOTIFY_PLAYLIST_ID, HOST = _a.HOST;
var SpotifyService = /** @class */ (function () {
    function SpotifyService() {
        this.createTrackURI = function (trackId) {
            return "spotify:track:" + trackId;
        };
        this.calculateExpireTime = function (expiresIn) {
            return new Date().getTime() / 1000 + expiresIn;
        };
        var redirectUri;
        if (process.env.PORT) {
            redirectUri = HOST + "/spotifyAuth";
        }
        else {
            redirectUri = HOST + ":" + AUTH_SERVER_PORT + "/spotifyAuth";
        }
        this.spotifyApi = new spotify_web_api_node_1.default({
            clientId: SPOTIFY_CLIENT_ID,
            clientSecret: SPOTIFY_CLIENT_SECRET,
            redirectUri: "" + redirectUri,
        });
        if (!fs_1.default.existsSync('./spotify-auth-store.json')) {
            fs_1.default.writeFileSync('./spotify-auth-store.json', JSON.stringify(new spotify_auth_1.default('', '', new Date().getTime() / 1000)));
        }
        this.spotifyAuth = JSON.parse(fs_1.default.readFileSync('./spotify-auth-store.json', 'utf8'));
    }
    SpotifyService.prototype.authorize = function (onAuth) {
        return __awaiter(this, void 0, void 0, function () {
            var e_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        console.log('Authorizing with Spotify');
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 6, , 7]);
                        if (!!this.spotifyAuth.refreshToken) return [3 /*break*/, 3];
                        console.log('No credentials found, performing new authorization');
                        return [4 /*yield*/, this.performNewAuthorization(onAuth)];
                    case 2:
                        _a.sent();
                        return [3 /*break*/, 5];
                    case 3:
                        console.log('Spotify credentials found');
                        this.spotifyApi.setAccessToken(this.spotifyAuth.accessToken);
                        this.spotifyApi.setRefreshToken(this.spotifyAuth.refreshToken);
                        return [4 /*yield*/, onAuth()];
                    case 4:
                        _a.sent();
                        _a.label = 5;
                    case 5: return [3 /*break*/, 7];
                    case 6:
                        e_1 = _a.sent();
                        console.error("Error authorizing with Spotify " + e_1);
                        process.exit(-1);
                        return [3 /*break*/, 7];
                    case 7: return [2 /*return*/];
                }
            });
        });
    };
    SpotifyService.prototype.addTrack = function (trackId, chatFeedback) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function () {
            var addSong, e_2;
            var _this = this;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        addSong = function () { return __awaiter(_this, void 0, void 0, function () {
                            var songInfo, e_3, e_4;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        console.log("Attempting to add " + trackId);
                                        return [4 /*yield*/, this.spotifyApi.getTrack(trackId)];
                                    case 1:
                                        songInfo = _a.sent();
                                        if (!ADD_TO_QUEUE) return [3 /*break*/, 5];
                                        _a.label = 2;
                                    case 2:
                                        _a.trys.push([2, 4, , 5]);
                                        return [4 /*yield*/, this.addToQueue(trackId, songInfo === null || songInfo === void 0 ? void 0 : songInfo.body.name)];
                                    case 3:
                                        _a.sent();
                                        chatFeedback("Success: " + (songInfo === null || songInfo === void 0 ? void 0 : songInfo.body.name) + " added to queue");
                                        return [3 /*break*/, 5];
                                    case 4:
                                        e_3 = _a.sent();
                                        if (e_3.message === 'Not Found') {
                                            console.error('Unable to add song to queue - Song may not exist or you may not have the Spotify client open and active');
                                        }
                                        else {
                                            console.error("Error: Unable to add song to queue - " + e_3.message);
                                        }
                                        chatFeedback("Fail: " + (songInfo === null || songInfo === void 0 ? void 0 : songInfo.body.name) + " not added to queue");
                                        return [3 /*break*/, 5];
                                    case 5:
                                        if (!ADD_TO_PLAYLIST) return [3 /*break*/, 9];
                                        _a.label = 6;
                                    case 6:
                                        _a.trys.push([6, 8, , 9]);
                                        return [4 /*yield*/, this.addToPlaylist(trackId, songInfo === null || songInfo === void 0 ? void 0 : songInfo.body.name)];
                                    case 7:
                                        _a.sent();
                                        chatFeedback("Success: " + (songInfo === null || songInfo === void 0 ? void 0 : songInfo.body.name) + " added to playlist");
                                        return [3 /*break*/, 9];
                                    case 8:
                                        e_4 = _a.sent();
                                        if (e_4.message === 'Duplicate Track') {
                                            chatFeedback("Fail (duplicate): " + (songInfo === null || songInfo === void 0 ? void 0 : songInfo.body.name) + " already in the playlist");
                                        }
                                        else {
                                            chatFeedback("Fail: " + (songInfo === null || songInfo === void 0 ? void 0 : songInfo.body.name) + " not added to playlist");
                                        }
                                        return [3 /*break*/, 9];
                                    case 9: return [2 /*return*/];
                                }
                            });
                        }); };
                        _c.label = 1;
                    case 1:
                        _c.trys.push([1, 6, , 7]);
                        if (!this.hasTokenExpired()) return [3 /*break*/, 3];
                        console.log('Spotify token expired, refreshing...');
                        return [4 /*yield*/, this.refreshToken(addSong)];
                    case 2:
                        _c.sent();
                        return [3 /*break*/, 5];
                    case 3: return [4 /*yield*/, addSong()];
                    case 4:
                        _c.sent();
                        _c.label = 5;
                    case 5: return [3 /*break*/, 7];
                    case 6:
                        e_2 = _c.sent();
                        console.error("Error adding track " + e_2);
                        if (((_b = (_a = e_2.body) === null || _a === void 0 ? void 0 : _a.error) === null || _b === void 0 ? void 0 : _b.message) === 'invalid id') {
                            chatFeedback('Fail (invalid ID): Link contains an invalid ID');
                        }
                        else {
                            chatFeedback('Fail: Error occurred adding track');
                        }
                        return [3 /*break*/, 7];
                    case 7: return [2 /*return*/];
                }
            });
        });
    };
    SpotifyService.prototype.addToQueue = function (trackId, songName) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.spotifyApi.addToQueue(this.createTrackURI(trackId))];
                    case 1:
                        _a.sent();
                        console.log("Added " + songName + " to queue");
                        return [2 /*return*/];
                }
            });
        });
    };
    SpotifyService.prototype.addToPlaylist = function (trackId, songName) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!SPOTIFY_PLAYLIST_ID) return [3 /*break*/, 5];
                        return [4 /*yield*/, this.doesPlaylistContainTrack(trackId)];
                    case 1:
                        if (!_a.sent()) return [3 /*break*/, 2];
                        console.log(songName + " is already in the playlist");
                        throw new Error('Duplicate Track');
                    case 2: return [4 /*yield*/, this.spotifyApi.addTracksToPlaylist(SPOTIFY_PLAYLIST_ID, [
                            this.createTrackURI(trackId),
                        ])];
                    case 3:
                        _a.sent();
                        console.log("Added " + songName + " to playlist");
                        _a.label = 4;
                    case 4: return [3 /*break*/, 6];
                    case 5:
                        console.error('Error: Cannot add to playlist - Please provide a playlist ID in the config file');
                        _a.label = 6;
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    SpotifyService.prototype.doesPlaylistContainTrack = function (trackId) {
        return __awaiter(this, void 0, void 0, function () {
            var playlistInfo, i;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.spotifyApi.getPlaylist(SPOTIFY_PLAYLIST_ID)];
                    case 1:
                        playlistInfo = _a.sent();
                        for (i = 0; i < playlistInfo.body.tracks.items.length; i++) {
                            if (playlistInfo.body.tracks.items[i].track.id === trackId) {
                                return [2 /*return*/, true];
                            }
                        }
                        return [2 /*return*/, false];
                }
            });
        });
    };
    SpotifyService.prototype.getAuthorizationUrl = function () {
        var scopes = [
            'user-modify-playback-state',
            'playlist-read-private',
            'playlist-modify-public',
            'playlist-modify-private',
        ];
        return this.spotifyApi.createAuthorizeURL(scopes, '');
    };
    SpotifyService.prototype.performNewAuthorization = function (onAuth) {
        return __awaiter(this, void 0, void 0, function () {
            var authUrl;
            var _this = this;
            return __generator(this, function (_a) {
                authUrl = this.getAuthorizationUrl();
                console.log('Click or go to the following link and give this app permissions');
                console.log("\n" + authUrl + "\n");
                auth_server_1.waitForCode(function (code) {
                    _this.spotifyApi.authorizationCodeGrant(code, function (error, data) { return __awaiter(_this, void 0, void 0, function () {
                        var accessToken, refreshToken, expireTime;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    if (error) {
                                        console.error(error);
                                        process.exit(-1);
                                    }
                                    accessToken = data.body['access_token'];
                                    refreshToken = data.body['refresh_token'];
                                    expireTime = this.calculateExpireTime(data.body['expires_in']);
                                    this.writeNewSpotifyAuth(accessToken, refreshToken, expireTime);
                                    this.spotifyApi.setAccessToken(accessToken);
                                    this.spotifyApi.setRefreshToken(refreshToken);
                                    return [4 /*yield*/, onAuth()];
                                case 1:
                                    _a.sent();
                                    return [2 /*return*/];
                            }
                        });
                    }); });
                });
                return [2 /*return*/];
            });
        });
    };
    SpotifyService.prototype.refreshToken = function (onAuth) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                try {
                    this.spotifyApi.setRefreshToken(this.spotifyAuth.refreshToken);
                    this.spotifyApi.refreshAccessToken(function (err, data) { return __awaiter(_this, void 0, void 0, function () {
                        var accessToken, expireTime;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    if (err) {
                                        console.error(err);
                                        process.exit(-1);
                                    }
                                    accessToken = data.body['access_token'];
                                    this.spotifyApi.setAccessToken(accessToken);
                                    expireTime = this.calculateExpireTime(data.body['expires_in']);
                                    this.writeNewSpotifyAuth(accessToken, this.spotifyAuth.refreshToken, expireTime);
                                    return [4 /*yield*/, onAuth()];
                                case 1:
                                    _a.sent();
                                    return [2 /*return*/];
                            }
                        });
                    }); });
                }
                catch (e) {
                    console.error("Error refreshing access token " + e);
                    process.exit(-1);
                }
                return [2 /*return*/];
            });
        });
    };
    SpotifyService.prototype.writeNewSpotifyAuth = function (accessToken, refreshToken, expireTime) {
        var newSpotifyAuth = new spotify_auth_1.default(accessToken, refreshToken, expireTime);
        this.spotifyAuth = newSpotifyAuth;
        fs_1.default.writeFile('./spotify-auth-store.json', JSON.stringify(newSpotifyAuth), function (err) {
            if (err)
                console.error(err);
        });
    };
    SpotifyService.prototype.hasTokenExpired = function () {
        return new Date().getTime() / 1000 >= this.spotifyAuth.expireTime;
    };
    return SpotifyService;
}());
exports.default = SpotifyService;
