import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { Toolbox } from 'bdt105toolbox/dist';


@Injectable()
export class ConfigurationService {

    private data: any;
    private toolbox: Toolbox = new Toolbox();

    constructor(private http: Http) {

    }

    public get(name: string): any {
        return this.toolbox.readFromStorage(name);
    }

    load(name: string, fileUrl: string, forever: boolean) {
        console.log("loading ..." + name)
        if (!this.data){
            this.data = [];
        }
        return new Promise((resolve, reject) => {
            this.http
                .get(fileUrl)
                .map(res => res.json())
                .subscribe(response => {
                    this.data[name] = response;
                    this.toolbox.writeToStorage(name, response, forever);
                    console.log(name + " loading complete", this.data)
                    resolve(true);
                })
        })
    }  
}