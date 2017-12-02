import { DatabaseService } from 'bdt105angulardatabaseservice';
import { ConnexionService } from 'bdt105angularconnexionservice';
export declare class TranslateService {
    private databaseService;
    private connexionService;
    translation: any[];
    private configuration;
    private toolbox;
    constructor(databaseService: DatabaseService, connexionService: ConnexionService);
    setDatabaseBaseUrl(baseUrl: string): void;
    translate(text: string): string;
    t(text: string): string;
    private loadFromDatabase(callBackSuccess, callBackFailure);
    private success(callBackSuccess, data);
    private failure(callBackFailure, data);
    getTranslateTag(): boolean;
    refresh(callBackSuccess: Function, callBackFailure: Function): void;
}
