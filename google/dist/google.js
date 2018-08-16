"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Google {
    constructor(gapi, API_KEY = null, CLIENT_ID = null, SCOPES = null, DISCOVERY_DOCS = null) {
        this.gapi = gapi;
        this.API_KEY = API_KEY;
        this.CLIENT_ID = CLIENT_ID;
        this.DISCOVERY_DOCS = DISCOVERY_DOCS ? DISCOVERY_DOCS : ["https://www.googleapis.com/discovery/v1/apis/drive/v3/rest"];
        this.SCOPES = SCOPES;
    }
    initClient(callback) {
        this.gapi.client.init({
            apiKey: this.API_KEY,
            clientId: this.CLIENT_ID,
            discoveryDocs: this.DISCOVERY_DOCS,
            scope: this.SCOPES
        }).then(() => {
            callback(true);
        });
    }
    signIn(callback) {
        if (this.gapi) {
            this.gapi.load('client:auth2', () => {
                this.gapi.auth2.init();
                let googleAuth = this.gapi.auth2.getAuthInstance();
                googleAuth.then(() => {
                    googleAuth.signIn({ scope: 'profile email', prompt: 'select_account' }).then((googleUser) => {
                        if (callback) {
                            callback(googleUser);
                        }
                    });
                });
            });
        }
        else {
            if (callback) {
                callback(null);
            }
        }
    }
    signOut(callback) {
        if (this.gapi && this.gapi.auth2) {
            let googleAuth = this.gapi.auth2.getAuthInstance();
            googleAuth.signOut().then(() => {
            });
        }
        if (callback) {
            callback();
        }
    }
    listFiles(callback) {
        this.gapi.client.drive.files.list({ 'pageSize': 10, 'fields': "nextPageToken, files(id, name)" }).then((response) => {
            var files = response.result.files;
            if (callback) {
                callback(files);
            }
        });
    }
}
exports.Google = Google;
//# sourceMappingURL=google.js.map