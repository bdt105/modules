import { Injectable, Inject } from '@angular/core';
import { Http, HttpModule } from '@angular/http';
import 'rxjs/add/operator/map';
import { Toolbox } from 'bdt105toolbox/dist';


@Injectable()
export class ConfigurationService {

    private data: any;
    private toolbox: Toolbox = new Toolbox();

    constructor (@Inject(Http) public http: Http) {

    }

    public get(localStorageKey: string = "configuration"): any {
        return this.toolbox.readFromStorage(localStorageKey);
    }

    load(localStorageKey: string = "configuration", fileUrl: string = "./assets/configuration.json", forever: boolean = false) {
        console.log("loading ..." + localStorageKey)
        if (!this.data){
            this.data = [];
        }
        return new Promise((resolve, reject) => {
            this.http
                .get(fileUrl)
                .map(res => res.json())
                .subscribe(response => {
                    this.data[localStorageKey] = response;
                    this.toolbox.writeToStorage(localStorageKey, response, forever);
                    console.log(localStorageKey + " loading complete", this.data)
                    resolve(true);
                })
        })
    }  
}