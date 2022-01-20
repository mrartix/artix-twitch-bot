"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var SpotifyAuth = /** @class */ (function () {
    function SpotifyAuth(accessToken, refreshToken, expireTime) {
        this.accessToken = accessToken;
        this.refreshToken = refreshToken;
        this.expireTime = expireTime;
    }
    return SpotifyAuth;
}());
exports.default = SpotifyAuth;
