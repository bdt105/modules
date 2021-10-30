import { Rest } from 'bdt105toolbox/dist'
import { stringify } from 'querystring';

export class SqlConfiguration {
    public databaseServer: string;
    public databaseUser: string;
    public databasePassword: string;
    public databasePort: number;
    public databaseName: string;
    public multipleStatements: boolean;
    public driver: string;
    public options: any;

    public userTableName: string;
    public loginFieldName: string;
    public passwordFieldName: string;
    /*
        constructor(databaseServer: string, port: number, user: string, password: string, database: string, userTableName: string = null, idFieldName: string = null, loginFieldName: string = null, passwordFieldName: string = null, emailFieldName: string = null, applicationFieldName: string = null) {
            this.databaseServer = databaseServer;
            this.user = user;
            this.password = password;
            this.port = port;
            this.database = database;
            this.userTableName = userTableName;
            this.loginFieldName = loginFieldName;
            this.passwordFieldName = passwordFieldName;
        }
    */
}

export class JwtConfiguration {
    public secret: string;
    public salt: string;
    public userRequestEmail: string;
    public adminToken: string;

    constructor(secret: string, salt: string, userRequestEmail: string, adminToken: string) {
        this.secret = secret;
        this.salt = salt;
        this.userRequestEmail = userRequestEmail;
        this.adminToken = adminToken;
    }
}

export class Token {
    public token: string;
    public status: string;
    public decoded: any;
    constructor(token: string, status: string, decoded: any) {
        this.token = token;
        this.status = status;
        this.decoded = decoded;
    }
}

export class Connexion {
    private sqlDriver: any;
    private mySqlConnexion: any;
    private jsonwebtoken: any;
    //private mssqlPoolRequest: any;
    public static readonly jwtStatusOk = "OK";
    public static readonly jwtStatusERR = "ERR";

    public sqlConfiguration: SqlConfiguration;
    public jwtConfiguration: JwtConfiguration;

    public rows: any;
    public err: any;
    public iss: string;
    public permissions: string;
    public epirationDate: number;
    public mySqlPool: any;
    public msSqlPool: any;

    private rest = new Rest();

    constructor(sqlConfiguration: SqlConfiguration = null, jwtConfiguration: JwtConfiguration = null) {
        this.sqlConfiguration = sqlConfiguration;
        this.jwtConfiguration = jwtConfiguration;
        if (sqlConfiguration.driver == 'mssql') {
            this.sqlDriver = require("mssql/msnodesqlv8")
        } else {
            this.sqlDriver = require('mysql');
        }
        this.jsonwebtoken = require('jsonwebtoken');
    }

    private log(text: string) {
        console.log(text);
    }

    private connectMySql() {
        this.mySqlConnexion = this.sqlDriver.createConnection({
            "host": this.sqlConfiguration.databaseServer,
            "user": this.sqlConfiguration.databaseUser,
            "port": this.sqlConfiguration.databasePort,
            "multipleStatements": this.sqlConfiguration.multipleStatements,
            "password": this.sqlConfiguration.databasePassword,
            "database": this.sqlConfiguration.databaseName
        });
        if (this.mySqlConnexion) {
            let err = this.mySqlConnexion.connect(
                (err: any) => this.callbackConnect(err)
            );
        }
        return this.mySqlConnexion;
    }

    private createSqlPool() {
        if (this.sqlConfiguration.driver == 'mysql') {
            this.mySqlPool = this.sqlDriver.createPool({
                "host": this.sqlConfiguration.databaseServer,
                "user": this.sqlConfiguration.databaseUser,
                "port": this.sqlConfiguration.databasePort,
                "password": this.sqlConfiguration.databasePassword,
                "database": this.sqlConfiguration.databaseName,
                "multipleStatements": this.sqlConfiguration.multipleStatements
            });
            console.log("MySql database pool created");
        }
        if (this.sqlConfiguration.driver == 'mssql') {
            this.msSqlPool = new this.sqlDriver.ConnectionPool({
                "server": this.sqlConfiguration.databaseServer,
                "database": this.sqlConfiguration.databaseName,
                "options": this.sqlConfiguration.options
            });
        }
    }

    public endSqlPool(callback: Function) {
        if (this.sqlConfiguration.driver == 'mysql') {
            if (this.mySqlPool) {
                this.mySqlPool.end((err: any) => {
                    if (err) {
                        this.log("Error ending mysqlpool" + stringify(err));
                    } else {
                        this.log("Mysql pool ended");
                    }
                    callback(err);
                });
            } else {
                this.log("Mysql pool NOT ended because undefined");
            }
        }
        if (this.sqlConfiguration.driver == 'mssql') {
            if (this.msSqlPool) {
                this.msSqlPool.close()
                this.log("Mssql pool closed");
                callback(null);
            }
        }
    }

    public queryPool(callback: Function, sql: string, closePool: boolean = false) {
        if (this.sqlConfiguration.driver == 'mysql') {
            this.mySqlQueryPool(callback, sql, closePool);
        }
        if (this.sqlConfiguration.driver == 'mssql') {
            this.msSqlQueryPool(callback, sql, closePool);
        }
    }

    private msSqlQueryPool(callback: Function, sql: string, closePool: boolean = false) {
        if (!this.msSqlPool) {
            this.createSqlPool();
        }
        this.msSqlPool.connect().then((pool: any) => {
            let poolRequest = pool.request();
            poolRequest.query(sql, (error: any, result: any) => {
                if (error) {
                    callback(error, null);
                } else {
                    if (result && result.recordset) {
                        callback(null, result.recordset);
                    } else {
                        callback(null, result);
                    }
                }
                if (closePool) {
                    this.endSqlPool((err: any) => {
                        this.log("queryPool - Mssql pool ended");
                    });
                }
            });
        });
    }

    private mySqlQueryPool(callback: Function, sql: string, closePool: boolean = false) {
        if (!this.mySqlPool) {
            this.createSqlPool();
        }
        this.mySqlPool.getConnection(
            (error: any, connection: any) => {
                if (error) {
                    callback(error, null);
                } else {
                    connection.query(sql, (err: any, rows: any) => {
                        callback(err, rows);
                        connection.release();
                        if (closePool) {
                            this.endSqlPool((err: any) => {
                                if (err) {
                                    this.log("queryPool - Error ending mysqlpool" + stringify(err));
                                } else {
                                    this.log("queryPool - Mysql pool ended");
                                }
                            });
                        }
                    });
                }
            }
        );
    }

    /*
        private getSqlConnexion() {
            return this.sqlConfiguration.driver == 'mysql' ? this.mySqlConnexion : this.mssqlConnexionPool;
        }
    */

    private releaseSql() {
        if (this.sqlConfiguration.driver == 'mysql' && this.mySqlConnexion) {
            this.mySqlConnexion.end(() => {
                if (this.mySqlConnexion) {
                    this.log('Connexion to the database as id ' + this.mySqlConnexion.threadId + ' ended !');
                }
            });
            this.mySqlConnexion = null;
        }
    }

    private callbackConnect(err: any) {
        this.err = err;
        if (err) {
            console.error('error connecting: ' + err.stack);
            this.releaseSql();
            return;
        }
        if (this.mySqlConnexion) {
            this.log('Connected to the database as id ' + this.mySqlConnexion.threadId);
        }
    }

    private callbackGetJwt(callback: Function, err: any, rows: any, password: string, jwtOptions: any, isPasswordCrypted: boolean) {
        this.rows = rows;
        this.err = err;
        let user: any = {};
        let jwt = null;
        this.releaseSql();
        if (rows && rows.length > 0) {
            let passwordOk = true;
            user = rows[0];
            if (password != null) {
                let comparePassword = isPasswordCrypted ? password : this.encrypt(password);
                passwordOk = comparePassword === user[this.sqlConfiguration.passwordFieldName];
            }
            if (passwordOk) {
                jwt = this.createJwt(user, jwtOptions);
                callback(err, jwt);
            } else {
                callback("Wrong password or login", jwt);
            }
        } else {
            if (callback) {
                callback(err, jwt);
            }
        }
    }

    private callbackQuerySql(callback: Function, err: any, rows: any, releaseConnexion: boolean = true) {
        if (releaseConnexion) {
            this.releaseSql();
        }

        if (callback) {
            callback(err, rows);
        }
    }

    querySql(callback: Function, sql: string, releaseConnexion: boolean = false) {
        if (this.sqlConfiguration.driver == 'mysql') {
            this.connectMySql();
            this.mySqlConnexion.query(sql,
                (err: any, rows: any) => this.callbackQuerySql(callback, err, rows, releaseConnexion));
        }
        if (this.sqlConfiguration.driver == 'mssql') {

            this.msSqlQueryPool(
                (err: any, rows: any) => this.callbackQuerySql(callback, err, rows, releaseConnexion), sql, releaseConnexion);
        }
    }

    querySqlWithoutConnexion(callback: Function, sql: string) {
        this.mySqlConnexion.query(sql,
            (err: any, rows: any) => callback(err, rows));
    }

    getJwt(callback: Function, login: string, password: string, where: string = null, jwtOptions: any = null, isPasswordCrypted = false, releaseConnexion = true) {
        let sql = "select * from " + this.sqlConfiguration.userTableName + " where " + this.sqlConfiguration.loginFieldName + " = '" + login + "'" + (where ? " and " + where : "");

        this.querySql(
            (err: any, rows: any) => this.callbackGetJwt(callback, err, rows, password, jwtOptions, isPasswordCrypted),
            sql, releaseConnexion)
        /*            
                this.connectMySql();
                if (this.mySqlConnexion) {
                    let sql = "select * from " + this.sqlConfiguration.userTableName + " where " + this.sqlConfiguration.loginFieldName + " = '" + login + "'" + (where ? " and " + where : "");
                    this.mySqlConnexion.query(sql,
                        (err: any, rows: any) => this.callbackGetJwt(callback, err, rows, password, jwtOptions, isPasswordCrypted));
                }
        */
    }

    createJwt(data: any, options: any = null) {
        let payload = JSON.parse(JSON.stringify(data))
        return this.jsonwebtoken.sign(payload, this.jwtConfiguration.secret, options);
    }

    checkJwt(token: string): Token {
        try {
            var decoded = this.jsonwebtoken.verify(token, this.jwtConfiguration.secret);
            if (decoded) {
                return new Token(token, Connexion.jwtStatusOk, decoded);
            }
        } catch (err) {
            return new Token(token, Connexion.jwtStatusERR, null);
        }
    }

    checkGoogleApi(callback: Function, token: string) {
        this.rest.call(
            (data: any, error: any) => {
                callback(data, error);
            }, "POST", "https://www.googleapis.com/oauth2/v1/tokeninfo?access_token=" + token
        )
    }

    decryptToken(callback: Function, token: string) {
        let ret: any = this.checkJwt(token);
        if (ret && ret.decoded) {
            ret.decoded.type = "standard";
            callback(ret, null);
        } else {
            this.checkGoogleApi(
                (data: any, error: any) => {
                    if (data && data.json) {
                        data.json.type = "google";
                        let ret = new Token(token, Connexion.jwtStatusOk, data.json);
                        callback(ret, null)
                    } else {
                        callback(null, error)
                    }
                }, token
            )
        }
    }

    checkJwtWithField(token: string, field: string, value: string): Token {
        try {
            var decoded = this.jsonwebtoken.verify(token, this.jwtConfiguration.secret);
            return new Token(token, Connexion.jwtStatusOk, decoded);
        } catch (err) {
            return new Token(token, Connexion.jwtStatusERR, null);
        }
    }

    isTokenValid(token: string): boolean {
        let jwt = this.checkJwt(token);
        if (jwt) {
            return jwt.status == Connexion.jwtStatusOk;
        } else {
            return false;
        }
    }

    encrypt(plain: string): string {
        var bcrypt = require('bcryptjs');
        var hash = bcrypt.hashSync(plain, this.jwtConfiguration.salt);
        return hash;
    }

    compareEncrypt(encrypted: string, plain: string): boolean {
        var bcrypt = require('bcryptjs');
        var hash = bcrypt.hashSync(plain, this.jwtConfiguration.salt);
        return hash === encrypted;
    }

    tryConnectSql() {
        this.connectMySql();
    }

    checkToken(callback: Function, token: string) {
        let ret: any = this.checkJwt(token);
        if (ret && ret.decoded) {
            ret.decoded.type = "standard";
            callback(ret, null);
        } else {
            this.checkGoogleApi(
                (data: any, error: any) => {
                    if (data && data.json) {
                        data.json.type = "google";
                        let ret = new Token(token, Connexion.jwtStatusOk, data.json);
                        callback(ret, null)
                    } else {
                        callback(null, error)
                    }
                }, token
            )
        }
    }

}