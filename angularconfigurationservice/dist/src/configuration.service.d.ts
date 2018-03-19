import { Http } from '@angular/http';
export declare class ConfigurationService {
    private http;
    private toolbox;
    data: any;
    private url;
    private storageKey;
    constructor(http: Http);
    load(): Promise<boolean>;
    get(): any;
    init(callbackSuccess: Function, callbackFailure: Function): void;
    private manageData(callbackSuccess, data);
    private manageError(callbackFailure, error);
}
