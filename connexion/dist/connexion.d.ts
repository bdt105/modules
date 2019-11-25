export declare class MySqlConfiguration {
    host: string;
    user: string;
    password: string;
    port: number;
    database: string;
    multipleStatements: boolean;
    userTableName: string;
    loginFieldName: string;
    passwordFieldName: string;
    constructor(host: string, port: number, user: string, password: string, database: string, userTableName?: string, idFieldName?: string, loginFieldName?: string, passwordFieldName?: string, emailFieldName?: string, applicationFieldName?: string);
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
    private mySql;
    private sqlConnexion;
    private jsonwebtoken;
    static readonly jwtStatusOk: string;
    static readonly jwtStatusERR: string;
    mySqlConfiguration: MySqlConfiguration;
    jwtConfiguration: JwtConfiguration;
    rows: any;
    err: any;
    iss: string;
    permissions: string;
    epirationDate: number;
    mySqlPool: any;
    constructor(mySqlConfiguration?: MySqlConfiguration, jwtConfiguration?: JwtConfiguration);
    private log(text);
    connectSql(): any;
    createSqlPool(): void;
    queryPool(callback: Function, sql: string): void;
    getSqlConnexion(): any;
    releaseSql(): void;
    private callbackConnect(err);
    private callbackGetJwt(callback, err, rows, password, jwtOptions, isPasswordCrypted);
    private callbackQuerySql(callback, err, rows);
    querySql(callback: Function, sql: string): void;
    querySqlWithoutConnexion(callback: Function, sql: string): void;
    getJwt(callback: Function, login: string, password: string, where?: string, jwtOptions?: any, isPasswordCrypted?: boolean): void;
    createJwt(data: any, options?: any): any;
    checkJwt(token: string): Token;
    checkJwtWithField(token: string, field: string, value: string): Token;
    isTokenValid(token: string): boolean;
    encrypt(plain: string): string;
    compareEncrypt(encrypted: string, plain: string): boolean;
    tryConnectSql(): void;
}
