export declare class SqlConfiguration {
    databaseServer: string;
    databaseUser: string;
    databasePassword: string;
    databasePort: number;
    databaseName: string;
    multipleStatements: boolean;
    driver: string;
    options: any;
    userTableName: string;
    loginFieldName: string;
    passwordFieldName: string;
}
export declare class JwtConfiguration {
    secret: string;
    salt: string;
    userRequestEmail: string;
    adminToken: string;
    constructor(secret: string, salt: string, userRequestEmail: string, adminToken: string);
}
export declare class Token {
    token: string;
    status: string;
    decoded: any;
    constructor(token: string, status: string, decoded: any);
}
export declare class Connexion {
    private sqlDriver;
    private mySqlConnexion;
    private jsonwebtoken;
    private mssqlConnexionPool;
    private mssqlPoolRequest;
    static readonly jwtStatusOk = "OK";
    static readonly jwtStatusERR = "ERR";
    sqlConfiguration: SqlConfiguration;
    jwtConfiguration: JwtConfiguration;
    rows: any;
    err: any;
    iss: string;
    permissions: string;
    epirationDate: number;
    mySqlPool: any;
    msSqlPool: any;
    private rest;
    constructor(sqlConfiguration?: SqlConfiguration, jwtConfiguration?: JwtConfiguration);
    private log;
    private connectMySql;
    private createSqlPool;
    endSqlPool(callback: Function): void;
    queryPool(callback: Function, sql: string, closePool?: boolean): void;
    private msSqlQueryPool;
    private mySqlQueryPool;
    private releaseSql;
    private callbackConnect;
    private callbackGetJwt;
    private callbackQuerySql;
    querySql(callback: Function, sql: string, releaseConnexion?: boolean): void;
    querySqlWithoutConnexion(callback: Function, sql: string): void;
    getJwt(callback: Function, login: string, password: string, where?: string, jwtOptions?: any, isPasswordCrypted?: boolean, releaseConnexion?: boolean): void;
    createJwt(data: any, options?: any): any;
    checkJwt(token: string): Token;
    checkGoogleApi(callback: Function, token: string): void;
    decryptToken(callback: Function, token: string): void;
    checkJwtWithField(token: string, field: string, value: string): Token;
    isTokenValid(token: string): boolean;
    encrypt(plain: string): string;
    compareEncrypt(encrypted: string, plain: string): boolean;
    tryConnectSql(): void;
    checkToken(callback: Function, token: string): void;
}
