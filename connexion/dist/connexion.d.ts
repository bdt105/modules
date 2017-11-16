export declare class MySqlConfiguration {
    host: string;
    user: string;
    password: string;
    port: string;
    database: string;
}
export declare class JwtConfiguration {
    secret: string;
    salt: string;
    userRequestEmail: string;
    adminToken: string;
}
export declare class Connexion {
    private mySql;
    private sqlConnexion;
    private jsonwebtoken;
    private jwtStatusOk;
    private jwtStatusERR;
    private toolbox;
    mySqlConfiguration: MySqlConfiguration;
    jwtConfiguration: JwtConfiguration;
    rows: any;
    err: any;
    iss: string;
    permissions: string;
    epirationDate: number;
    userTableName: string;
    loginFieldName: string;
    passwordFieldName: string;
    constructor(mySqlConfiguration: MySqlConfiguration, jwtConfiguration: JwtConfiguration);
    private log(text);
    private connectSql();
    private releaseSql();
    private callbackConnect(err);
    private callbackGetJwt(callback, err, rows, plainPassword);
    private callbackQuerySql(callback, err, rows);
    querySql(callback: Function, sql: string): void;
    getJwt(callback: Function, login: string, plainPassword: string, where?: string): void;
    checkJwt(token: string): {
        "token": string;
        "status": string;
        "decoded": any;
    };
    isTokenValid(token: string): boolean;
    encrypt(plain: string): any;
    compareEncrypt(encrypted: string, plain: string): boolean;
    tryConnectSql(): void;
}
