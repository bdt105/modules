import { Http } from '@angular/http';
export declare class TranslateLocalService {
    private http;
    private toolbox;
    private translateData;
    private currentText;
    private baseurl;
    private storageKey;
    private fileUrl;
    data: any;
    language: string;
    constructor(http: Http);
    load(): Promise<boolean>;
    get(): any;
    translate(text: string): any;
    init(callbackSuccess: Function, callbackFailure: Function, fileUrl: string, storageKey: string): void;
    private manageData(callbackSuccess, data);
    private manageError(callbackFailure, error);
}
