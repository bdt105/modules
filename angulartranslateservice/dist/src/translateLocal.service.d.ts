import { Http } from '@angular/http';
export declare class TranslateLocalService {
    private http;
    private toolbox;
    private translateData;
    private currentText;
    private baseurl;
    private storageKey;
    private baseUrl;
    private url;
    data: any;
    language: string;
    constructor(http: Http);
    get(): any;
    load(): Promise<boolean>;
    translate(text: string): any;
    init(callbackSuccess: Function, callbackFailure: Function, fileUrl: string, storageKey: string): void;
    private manageData(callbackSuccess, data);
    private manageError(callbackFailure, error);
}
