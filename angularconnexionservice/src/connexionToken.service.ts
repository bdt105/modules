import { Injectable, Inject, ReflectiveInjector } from '@angular/core';
import { Toolbox } from 'bdt105toolbox/dist';
import { HttpModule, Http } from '@angular/http';


@Injectable()
export class ConnexionTokenService {

    private toolbox: Toolbox = new Toolbox(); 
    private translateData : any; 
    private currentText: string;
    private language = "FR";
    private url = './assets/translate' + this.language + '.json';
    private storageKey = "connexion";

    public authentificationApiBaseUrl = "";

    constructor(@Inject(Http) public http: Http){
    }

    public connect (callbackSuccess: Function, callbackFailure: Function, log: string, passwd: string, forever: boolean = false){
        let body: any = {};
        body.login = log;
        body.password = passwd;

        this.http.post(this.authentificationApiBaseUrl + "get", body).subscribe(
            (data: any) => this.connexionSuccess(callbackSuccess, data, forever),
            (error: any) => this.connexionFailure(callbackFailure, error)
        );
        // Fake connexion
        // let fakeUser = this.getFakeUser();
    }

    public connect2 (http: Http, callbackSuccess: Function, callbackFailure: Function, log: string, passwd: string, forever: boolean = false){
        let body: any = {};
        body.login = log;
        body.password = passwd;

        http.post(this.authentificationApiBaseUrl + "get", body).subscribe(
            (data: any) => this.connexionSuccess(callbackSuccess, data, forever),
            (error: any) => this.connexionFailure(callbackFailure, error)
        );
        // Fake connexion
        // let fakeUser = this.getFakeUser();
    }

    private getFakeUser(){
        return {
            "iduser": 1,
            "lastName": "fake",
            "firstName": "fake"
        }
    }

    private connexionSuccess(callback: Function, data: any, forever: boolean){
        let dat = JSON.parse(data._body);
        this.saveConnexion(data._body, forever);
        if (callback){
            callback(data._body);
        }
    }

    private connexionFailure(callback: Function, error: any){
        if (callback){
            callback(error);
        }    
    }

    public disconnect(){
        this.removeConnexion();
    }

    public isConnected(){
        let conn = this.get();
        if (conn){
            return conn.decoded != null;
        }else{
            return false;
        }
    }

    public get(){
        return this.toolbox.readFromStorage(this.storageKey);
    }

    public getToken(){
        let conn = this.get();
        if (conn){
            return conn.token;
        }
        return null;
    }

    public saveConnexion(connexion: any, forever: boolean = false){
        this.toolbox.writeToStorage(this.storageKey, connexion, forever);
    }
    
    public removeConnexion(){
        this.toolbox.removeFromStorage(this.storageKey);
    }

    public getUser(){
        let conn = this.get();
        if (conn && conn.decoded){
            return conn.decoded;
        }
        return null;
    }

}