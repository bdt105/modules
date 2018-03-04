import { DatabaseService } from 'bdt105angulardatabaseservice';
export declare class ConnexionService {
    databaseService: DatabaseService;
    connexion: any;
    private tableName;
    redirectUrl: string;
    private toolbox;
    constructor(databaseService: DatabaseService);
    connectFake(): void;
    disconnect(): boolean;
    get(): any;
    save(connexion?: any, rememberMe?: boolean): void;
    connect(customCallBackSuccess: Function, customCallBackFailure: Function, login: string, password: string, rememberMe: boolean): void;
    changeCurrentUserLang(lang: string): void;
    private success(customCallBackSuccess, rememberMe, data);
    private failure(customCallBackFailure, data);
    getUser(): any;
    getCurrentUser(): any;
    isConnected(): any;
}
