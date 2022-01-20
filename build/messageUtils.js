"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTrackIdFromLink = exports.SPOTIFY_LINK_START = void 0;
exports.SPOTIFY_LINK_START = 'https://open.spotify.com/track/';
exports.getTrackIdFromLink = function (link) {
    try {
        var startOfId = exports.SPOTIFY_LINK_START.length;
        var endOfId = link.indexOf('?');
        if (startOfId > 0 && endOfId > 0) {
            return link.substring(startOfId, endOfId);
        }
        else if (startOfId > 0 && endOfId === -1) {
            return link.substring(startOfId);
        }
        else {
            // noinspection ExceptionCaughtLocallyJS
            throw Error('No track ID found in URL');
        }
    }
    catch (e) {
        console.error("Unable to parse trackId " + e);
    }
    return null;
};
