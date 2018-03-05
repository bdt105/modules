import { Injectable } from '@angular/core';
import { DatabaseService } from 'bdt105angulardatabaseservice';
import { ConnexionService } from 'bdt105angularconnexionservice';
import { Toolbox } from 'bdt105toolbox/dist';

@Injectable()
export class TranslateService {
    translation: any[];
    
    private configuration = { "translateTags" : true};
    private toolbox: Toolbox = new Toolbox();
    
    constructor(private databaseService: DatabaseService, private connexionService: ConnexionService){
        this.translation = this.toolbox.readFromStorage("translation");
        if (!this.translation){
            let callback = function(){

            }
            this.loadFromDatabase(callback, callback);
        }
    }

    public setDatabaseBaseUrl(baseUrl: string){
        this.databaseService.configuration.baseUrl = baseUrl;
    }

    public translate(text: string): string{
        if (this.translation){
            for (var i = 0; i < this.translation.length; i++){
                if (this.translation[i].name == text){
                    return this.translation[i].label;
                }
            }
        }
        return text;
    }

    public t(text: string){
        return this.translate(text);
    }

    private loadFromDatabase(callBackSuccess: Function, callBackFailure: Function) {
        var conn = this.connexionService.get();
        if (conn){
            this.databaseService.connect(conn.currentUser.login, conn.currentUser.password);
            var sql = "SELECT * FROM label where user = 'everyone' and domain = 'rest' and lang = '" + conn.currentUser.lang + "'";
            this.databaseService.sql(
                (data: any) => this.success(callBackSuccess, data), 
                (data: any) => this.failure(callBackFailure, data), sql);
        }
    }

    private success(callBackSuccess: Function, data: any){
        this.translation = data.json.results;
        this.toolbox.writeToStorage("translation", this.translation, false);
        if (callBackSuccess){
            callBackSuccess(data);
        }
    };

    private failure (callBackFailure: Function, data: any){
        if (callBackFailure){
            callBackFailure(data);
        }
    };

    public getTranslateTag (){
        var setting = this.toolbox.readFromStorage("setting");
        var translateTags = this.configuration.translateTags;
        if (setting && setting.translateTags){
            translateTags = setting.translateTags;
        }
        return translateTags;
    };

    public refresh(callBackSuccess: Function, callBackFailure: Function){
        this.loadFromDatabase(callBackSuccess, callBackFailure);
    }
    
}