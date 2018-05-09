import { Toolbox } from "bdt105toolbox/dist";

export class Google {
    private gapi: any;
    private API_KEY: string;
    private CLIENT_ID: string;
    private DISCOVERY_DOCS: any;
    private SCOPES: string;

    constructor(gapi: any, API_KEY: string = null, CLIENT_ID: string = null, SCOPES: string = null, DISCOVERY_DOCS: string = null){
        this.gapi = gapi;
        this.API_KEY = API_KEY;
        this.CLIENT_ID = CLIENT_ID;
        this.DISCOVERY_DOCS = DISCOVERY_DOCS ? DISCOVERY_DOCS : ["https://www.googleapis.com/discovery/v1/apis/drive/v3/rest"];
        this.SCOPES = SCOPES;
        }

    initClient(callback: Function) {
        this.gapi.client.init({
            apiKey: this.API_KEY,
            clientId: this.CLIENT_ID,
            discoveryDocs: this.DISCOVERY_DOCS,
            scope: this.SCOPES
        }).then(() => {
            callback(true);
        });
    }

    signIn(callback: Function) {
        if (this.gapi){
            this.gapi.load('client:auth2', () => {
                this.gapi.auth2.init()
                let googleAuth = this.gapi.auth2.getAuthInstance();
                googleAuth.then(() => {
                    googleAuth.signIn({scope: 'profile email', prompt: 'select_account'}).then((googleUser: any) => {
                        if (callback){
                            callback(googleUser);
                        }
                    });
                });
            });        
        }
    }  

    listFiles(callback: Function) {
        this.gapi.client.drive.files.list({'pageSize': 10, 'fields': "nextPageToken, files(id, name)"}).then((response: any) => {
            var files = response.result.files;
            if(callback){
                callback(files);
            }
        });
      }    

}