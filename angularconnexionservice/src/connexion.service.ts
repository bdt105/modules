import { Injectable, Inject } from '@angular/core';
import { DatabaseService } from 'bdt105angulardatabaseservice';
import { Toolbox } from 'bdt105toolbox/dist';

@Injectable()
export class ConnexionService {
    public connexion: any;
    private tableName = "user";

    public redirectUrl: string;

    private toolbox: Toolbox = new Toolbox();

    constructor(@Inject(DatabaseService) public databaseService: DatabaseService ) {

    }

    public connectFake() {
        let callback = () => {

        }
        this.connect(callback, callback, "chlux", "chlux", true);
    }

    disconnect() {
        this.toolbox.removeFromStorage("connexion")
        this.connexion = null;
        return true;
    };

    public get() {
        var conn = this.toolbox.readFromStorage("connexion");
        if (typeof conn == "object") {
            this.connexion = conn;
            return this.connexion;
        } else {
            return null;
        }
    };

    public save(connexion: any = null, rememberMe: boolean = false){
        if (connexion){
            this.connexion = connexion;
        }

        this.toolbox.writeToStorage("connexion", this.connexion, rememberMe);        
    }

    public connect(customCallBackSuccess: Function, customCallBackFailure: Function, login: string, password: string, rememberMe: boolean) {
        this.databaseService.login = login;
        this.databaseService.password = password;
        var where = "email='" + login + "' AND password='" + password + "'";
        var body = { "__where": where };
        this.databaseService.read(
            (data: any) => this.success(customCallBackSuccess, rememberMe, data),
            (data: any) => this.failure(customCallBackSuccess, data), this.tableName, body
        );
    };

    public changeCurrentUserLang(lang: string) {
        if (this.connexion && this.connexion.currentUser) {
            this.connexion.currentUser.lang = lang;
            this.toolbox.writeToStorage("connexion", this.connexion, false);
        }
    }

    private success(customCallBackSuccess: Function, rememberMe: boolean, data: any) {
        var currentUser = data.json.results[0];
        currentUser.login = currentUser.email;
        this.connexion = { "currentUser": currentUser };
        this.toolbox.writeToStorage("connexion", this.connexion, rememberMe)
        if (customCallBackSuccess !== null) {
            customCallBackSuccess(this.connexion);
        }
    };

    private failure(customCallBackFailure: Function, data: any) {
        this.disconnect();
        if (customCallBackFailure !== null) {
            customCallBackFailure(data);
        }
    }

    public getUser(){
        let conn = this.get();
        if (conn && conn.currentUser){
            return conn.currentUser;
        }
        return null;
    }    

    public getCurrentUser(){
        return this.getUser()
    }

    public isConnected(){
        let conn = this.get();
        return conn && conn.currentUser;
    }

}