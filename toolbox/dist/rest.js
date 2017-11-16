"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var toolbox_1 = require("./toolbox");
var Rest = (function () {
    function Rest(logFileName, logToConsole) {
        if (logFileName === void 0) { logFileName = null; }
        if (logToConsole === void 0) { logToConsole = false; }
        this.logFileName = logFileName;
        this.logToConsole = logToConsole;
        this.toolbox = new toolbox_1.Toolbox();
    }
    Rest.prototype.call = function (callback, method, url, body, contentType, getRaw) {
        var _this = this;
        if (body === void 0) { body = null; }
        if (contentType === void 0) { contentType = "application/json"; }
        if (getRaw === void 0) { getRaw = false; }
        var request = require('request');
        var options = {
            "method": method,
            "headers": {
                "content-type": contentType,
                "Accept": "*/*"
            },
            "uri": url,
            "body": JSON.stringify(body)
        };
        request(options, function (error, response, bbody) {
            var data = {};
            if (getRaw) {
                data.raw = bbody;
            }
            if (error) {
                data.error = error;
            }
            if (response) {
                data.url = response.request.href;
                data.statusCode = response.statusCode;
            }
            else {
                data.statusCode = "ERR";
            }
            if (bbody && typeof bbody === "string") {
                data.json = _this.toolbox.xml2json(bbody);
            }
            _this.toolbox.log(url + JSON.stringify(data), _this.logFileName, _this.logToConsole);
            if (callback) {
                callback(data, data.error);
            }
        });
    };
    return Rest;
}());
exports.Rest = Rest;
