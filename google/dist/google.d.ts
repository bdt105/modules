export declare class Google {
    private gapi;
    private API_KEY;
    private CLIENT_ID;
    private DISCOVERY_DOCS;
    private SCOPES;
    constructor(gapi: any, API_KEY?: string, CLIENT_ID?: string, SCOPES?: string, DISCOVERY_DOCS?: string);
    initClient(callback: Function): void;
    signIn(callback: Function): void;
    signOut(callback: Function): void;
    listFiles(callback: Function): void;
}
