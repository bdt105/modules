import { Http } from '@angular/http';
export declare class ConnexionTokenService {
    http: Http;
    private toolbox;
    private translateData;
    private currentText;
    private language;
    private url;
    private storageKey;
    authentificationApiBaseUrl: string;
    constructor(http: Http);
    connect(callbackSuccess: Function, callbackFailure: Function, log: string, passwd: string, forever?: boolean): void;
    connect2(http: Http, callbackSuccess: Function, callbackFailure: Function, log: string, passwd: string, forever?: boolean): void;
    private getFakeUser();
    private connexionSuccess(callback, data, forever);
    private connexionFailure(callback, error);
    disconnect(): void;
    isConnected(): boolean;
    get(): any;
    getToken(): any;
    saveConnexion(connexion: any, forever?: boolean): void;
    removeConnexion(): void;
    getUser(): any;
}
