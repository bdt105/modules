"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const google_1 = require("./google");
var a = 3;
var gapi;
var g = new google_1.Google(gapi, "AIzaSyC_Z03toYc3LSajHrZx1F0iL_PNsUV0sfA", "736533837421-d8mdi5lapv3s5u5ugorcln4kokug391q.apps.googleusercontent.com", "https://www.googleapis.com/auth/drive.metadata.readonly");
var callbackInit = (data) => {
    var callbackList = (data) => {
        for (var i = 0; i < data.length; i++) {
            console.log(data[i]);
        }
    };
};
g.initClient;
//# sourceMappingURL=test.js.map