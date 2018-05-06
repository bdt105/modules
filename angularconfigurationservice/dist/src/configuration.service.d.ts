import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
export declare class ConfigurationService {
    private http;
    private data;
    private toolbox;
    constructor(http: Http);
    get(name: string): any;
    load(name: string, fileUrl: string, forever: boolean): Promise<{}>;
}
