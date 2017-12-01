import { Injectable } from '@angular/core';
import { Http, RequestOptions, RequestMethod, Headers } from '@angular/http';
import { Toolbox } from 'bdt105toolbox/dist';

class DatabaseOption {
    constructor( 
        public where?: string,
        public orderby?: string,
        public groupby?: string,
        public limit?: string,
        public offset?: string){
    }
}

@Injectable()
export class DatabaseService {
    constructor (private http: Http) {

    }

    public body: any;
    public login: string;
    public password: string;
    public contentType = "application/json";

    private toolbox: Toolbox = new Toolbox();
    public configuration = {
        "baseUrl": "http://editeur.vidal.fr/demo/apidb/demonstrationEditeur",
        "baseUrlOld": "http://localhost/apidb/demonstrationLocalhost",
        "sql": "/sql",
        "update": "/update",
        "read": "/read",
        "fresh": "/fresh",
        "structure": "/structure",
        "insert": "/insert",
        "save": "/save",
        "delete": "/delete",
        "fields": "/fields",
        "count": "/count"
    };
    
    private setHeaders (): Headers{
        var auth = "Basic " + btoa(this.login + ":" + this.password);
        var headers = new Headers();
        headers.append("Authorization", auth);
        headers.append("Content-Type", "application/json");
        return headers;
    }

    private manageData (callback: any, data: any){
        this.toolbox.log(data);
        if (data._body && (typeof data._body  == "string")){
            if ((<string>data._body).startsWith("<?xml version")){
                data.json = this.toolbox.xml2json(data._body);
            }else{
                data.json = this.toolbox.parseJson(data._body);
            }
        }
        callback(data);
    };

    private manageError (callback: any, error: any){
        console.log(error);
        callback(error);
    };

    public callPost(callbackSuccess: Function, callbackFailure: Function, url: string, body: any){
        var headrs = this.setHeaders();
        this.toolbox.log(url);
        this.toolbox.log(body);
        this.toolbox.log(JSON.stringify(body));
        this.http.post(url, body, {headers: headrs}).subscribe(
            (data) => this.manageData(callbackSuccess, data),
            (error) => this.manageError(callbackFailure, error)
        );
    }

    public callGet(callbackSuccess: Function, callbackFailure: Function, url: string){
        var headrs = this.setHeaders();
        this.toolbox.log(url);
        this.http.get(url, {headers: headrs}).subscribe(
            (data) => this.manageData(callbackSuccess, data),
            (error) => this.manageError(callbackFailure, error)
        );
    }

    private calll(callbackSuccess: Function, callbackFailure: Function, api: string, tableName: string, element?: any){
        if (tableName){
            var url = this.configuration.baseUrl + api + "/" + tableName;
            this.callPost(callbackSuccess, callbackFailure, url, element);
        }
    }

    connect(login: string, password: string){
        this.login = login;
        this.password = password;
    }

    sql (callbackSuccess: Function, callbackFailure: Function, sql: string, limit = "5000"){
        var url = this.configuration.baseUrl + this.configuration.sql;
        var body = {"__sql": sql, "__limit": limit};
        this.callPost(callbackSuccess, callbackFailure, url, body);
    }

    read (callbackSuccess: Function, callbackFailure: Function, tableName: string, element: any){
        this.calll(callbackSuccess, callbackFailure, this.configuration.read, tableName, element);
    }

    insert (callbackSuccess: Function, callbackFailure: Function, tableName: string, element: any){
        this.calll(callbackSuccess, callbackFailure, this.configuration.insert, tableName, element);
    };

    delete (callbackSuccess: Function, callbackFailure: Function, tableName: string, element: any){
        this.calll(callbackSuccess, callbackFailure, this.configuration.delete, tableName, element);
    };

    save (callbackSuccess: Function, callbackFailure: Function, tableName: string, element: any){
        this.calll(callbackSuccess, callbackFailure, this.configuration.save, tableName, element);
    };

    fields (callbackSuccess: Function, callbackFailure: Function, tableName: string){
        this.calll(callbackSuccess, callbackFailure, this.configuration.fields, tableName);
    };

    private successNeww(data: any, callbackSuccess: Function){
        var fields = data.json.results;
        var newItem: any = {};
        for (var i= 0; i < fields.length; i++){
            newItem[fields[i].Field] = "";
        }
        if (callbackSuccess){
            callbackSuccess(newItem)
        }
    }

    private failureNeww(data: any, callbackFailure: Function){
        if (callbackFailure){
            callbackFailure(data);
        }
    }

    neww(callbackSuccess: Function, callbackFailure: Function, tableName: string){
        this.fields(
            (data: any) => this.successNeww(data, callbackSuccess),
            (data: any) => this.failureNeww(data, callbackFailure), tableName);
    }

}