import { DatabaseService } from 'bdt105angulardatabaseservice';
export declare class ConnexionService {
    private databaseService;
    connexion: any;
    private tableName;
    redirectUrl: string;
    private toolbox;
    private vidal;
    constructor(databaseService: DatabaseService);
    connectFake(): void;
    disconnect: () => boolean;
    getConnexion: () => any;
    connect(customCallBackSuccess: Function, customCallBackFailure: Function, login: string, password: string, rememberMe: boolean): void;
    changeCurrentUserLang(lang: string): void;
    private success(customCallBackSuccess, rememberMe, data);
    private successAfterLogin(customCallBackSuccess, login, password, rememberMe, data);
    private callbackAfterAfterLogin(data, error, customCallBackSuccess, login, password, rememberMe);
    private failureAfterAfterLogin(data, customCallBackFailure);
    private failureAfterLogin(customCallBackSuccess, customCallBackFailure, login, password, rememberMe, data);
    private failure(customCallBackSuccess, customCallBackFailure, login, password, rememberMe, data);
}
