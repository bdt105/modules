import { Injectable } from '@angular/core';
import { DatabaseService } from 'bdt105angulardatabaseservice';
import { Toolbox } from 'bdt105toolbox/dist';
import { Vidal } from 'bdt105vidal/dist';

@Injectable()
export class ConnexionService {
    public connexion: any;
    private tableName = "user";

    public redirectUrl: string;

    private toolbox: Toolbox = new Toolbox();  
    private vidal: Vidal = new Vidal("dbd540aa", "8343650ea233a4716f524ab77dc24948");  

    constructor (private databaseService: DatabaseService){

    }

    connectFake(){
        let callback = function(){

        }
        this.connect(callback, callback, "chlux", "chlux", true);
    }

    disconnect = function (){
        this.toolbox.removeFromStorage("connexion")
        this.connexion = null;
        return true;
    };
    
    getConnexion = function(){
        var conn = this.toolbox.readFromStorage("connexion");
        if (typeof conn == "object"){
            this.connexion = conn;
            return this.connexion;
        } else {
            return null;
        }
    };

    connect (customCallBackSuccess: Function, customCallBackFailure: Function, login: string, password: string, rememberMe: boolean){
        this.databaseService.login = login;
        this.databaseService.password = password;
        var where = "email='" + login + "' AND password='" + password + "'";
        var body = {"__where": where};
        this.databaseService.read(
            (data: any) => this.success(customCallBackSuccess, rememberMe, data),
            (data: any) => this.failure(customCallBackSuccess, customCallBackFailure, login, password, rememberMe, data), this.tableName, body
        );
    };

	changeCurrentUserLang(lang: string){
		if (this.connexion && this.connexion.currentUser){
			this.connexion.currentUser.lang = lang;
			this.toolbox.writeToStorage("connexion", this.connexion, false);
		}
	}    

    private success (customCallBackSuccess: Function, rememberMe: boolean, data: any){
        var currentUser = data.json.results[0];
        currentUser.login = currentUser.email;
        this.connexion = {"currentUser": currentUser};
        this.toolbox.writeToStorage("connexion", this.connexion, rememberMe)
        if (customCallBackSuccess !== null){
            customCallBackSuccess(this.connexion);
        }
    };

    private successAfterLogin (customCallBackSuccess: Function, login: string, password: string, rememberMe: boolean, data: any){
        var currentUser: any = {"login": login, "password": password};
        this.connexion = {"currentUser": currentUser};
        this.toolbox.writeToStorage("connexion", this.connexion, rememberMe)
        if (customCallBackSuccess !== null){
            customCallBackSuccess(this.connexion);
        }
    }
    
    private callbackAfterAfterLogin(data: any, error: any, customCallBackSuccess: Function, login: string, password: string, rememberMe: boolean){
        var currentUser: any = {"login": "editeurs@vidal.fr", "password": "editeurs", "lang": "FR", "country": "FR"};
        this.connexion = {"currentUser": currentUser};
        this.toolbox.writeToStorage("connexion", this.connexion, rememberMe)
        if (customCallBackSuccess !== null){
            customCallBackSuccess(this.connexion);
        }
    }

    private failureAfterAfterLogin(data: any, customCallBackFailure: Function){
        this.disconnect();
        if (customCallBackFailure !== null){
            customCallBackFailure(data);
        }
    }

    private failureAfterLogin (customCallBackSuccess: Function, customCallBackFailure: Function, login: string, password: string, rememberMe: boolean, data: any){
        let params: any = [];
        let callback = (data: any, error: any) => {
            if (data){
                this.callbackAfterAfterLogin(data, error, customCallBackSuccess, login, password, rememberMe);
            }
            if (error){
                this.failureAfterAfterLogin(data, customCallBackFailure);
            }
        };
        this.vidal.getVersion(
            (data: any, error: any) => callback(data, error), params, "app_id=" + login + "&app_key=" + password);        
    }
    
    private failure (customCallBackSuccess: Function, customCallBackFailure: Function, login: string, password: string, rememberMe: boolean, data: any){
        this.failureAfterLogin(customCallBackSuccess, customCallBackFailure, login, password, rememberMe, data);
    };
   
}