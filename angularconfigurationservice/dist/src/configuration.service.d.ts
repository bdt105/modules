import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
export declare class ConfigurationService {
    http: Http;
    private data;
    private toolbox;
    constructor(http: Http);
    get(localStorageKey?: string): any;
    load(localStorageKey?: string, fileUrl?: string, forever?: boolean): Promise<{}>;
    loadAutonomous(fileUrl?: string, forever?: boolean): Promise<{}>;
}
