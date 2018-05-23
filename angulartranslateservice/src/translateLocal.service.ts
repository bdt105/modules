import { Injectable, Inject } from '@angular/core';
import { Toolbox } from 'bdt105toolbox/dist';
import { Http, HttpModule } from '@angular/http';

@Injectable()
export class TranslateLocalService {

    private toolbox: Toolbox = new Toolbox(); 
    private translateData : any; 
    private currentText: string;
    private baseurl: string;
    private storageKey = "translate";
    private fileUrl = './assets/transalte.json';
    public data: any; 

    public language: string;

    constructor(@Inject(Http) private http: Http){
    }

    public load(): Promise<boolean> {
        return new Promise <boolean> ((resolve) => {
            let trans = this.get(); 
            if (!trans){
                setTimeout(() => {
                    console.log('Translation loaded ?!');
                    resolve(true);
                }, 2000);
            }else{
                resolve(true);
            }
        });
    }      

    public get(){
        this.data = this.toolbox.readFromStorage(this.storageKey);
        if (this.data){
            return this.data; 
        }
        return null;
    }

    public translate (text: string){
        this.currentText = text;
        this.translateData = this.toolbox.readFromStorage(this.storageKey);
        if (this.translateData){
            let t = this.toolbox.filterArrayOfObjects(this.translateData, "key", text);
            if (t && t.length > 0){ 
                return t[0].value;
            }
        }
        return text;
    }

    public init (callbackSuccess: Function, callbackFailure: Function, fileUrl: string, storageKey: string){
        this.fileUrl = fileUrl;
        this.storageKey = storageKey;
        this.http.get(this.fileUrl).subscribe(
            (data: any) => this.manageData(callbackSuccess, data),
            (error: any) => this.manageError(callbackFailure, error)
        );
    }

    private manageData (callbackSuccess: Function, data: any){
        this.toolbox.log(data);
        this.translateData = this.toolbox.parseJson(data._body);
        this.toolbox.writeToStorage(this.storageKey, this.translateData, false);
        if (callbackSuccess){
            callbackSuccess(this.data);
        }
    };

    private manageError (callbackFailure: Function, error: any){
        console.log(error);
        if (callbackFailure){
            callbackFailure(error);
        }        
    };
}