import { Rest } from 'bdt105toolbox/dist'
import { stringify } from 'querystring';

export class MySqlConfiguration {
    public host: string;
    public user: string;
    public password: string;
    public port: number;
    public database: string;
    public multipleStatements: boolean;

    public userTableName: string;
    public loginFieldName: string;
    public passwordFieldName: string;

    constructor(host: string, port: number, user: string, password: string, database: string, userTableName: string = null, idFieldName: string = null, loginFieldName: string = null, passwordFieldName: string = null, emailFieldName: string = null, applicationFieldName: string = null) {
        this.host = host;
        this.user = user;
        this.password = password;
        this.port = port;
        this.database = database;
        this.userTableName = userTableName;
        this.loginFieldName = loginFieldName;
        this.passwordFieldName = passwordFieldName;
    }
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
    private mySql: any;
    private sqlConnexion: any;
    private jsonwebtoken: any;
    public static readonly jwtStatusOk = "OK";
    public static readonly jwtStatusERR = "ERR";

    public mySqlConfiguration: MySqlConfiguration;
    public jwtConfiguration: JwtConfiguration;

    public rows: any;
    public err: any;
    public iss: string;
    public permissions: string;
    public epirationDate: number;
    public mySqlPool: any;

    private rest = new Rest();

    constructor(mySqlConfiguration: MySqlConfiguration = null, jwtConfiguration: JwtConfiguration = null) {
        this.mySqlConfiguration = mySqlConfiguration;
        this.jwtConfiguration = jwtConfiguration;
        this.mySql = require('mysql');
        this.jsonwebtoken = require('jsonwebtoken');
    }

    private log(text: string) {
        console.log(text);
    }

    public connectSql() {
        this.sqlConnexion = this.mySql.createConnection({
            "host": this.mySqlConfiguration.host,
            "user": this.mySqlConfiguration.user,
            "port": this.mySqlConfiguration.port,
            "multipleStatements": this.mySqlConfiguration.multipleStatements,
            "password": this.mySqlConfiguration.password,
            "database": this.mySqlConfiguration.database
        });
        if (this.sqlConnexion) {
            let err = this.sqlConnexion.connect(
                (err: any) => this.callbackConnect(err)
            );
        }
        return this.sqlConnexion;
    }

    public createSqlPool() {
        this.mySqlPool = this.mySql.createPool({
            "host": this.mySqlConfiguration.host,
            "user": this.mySqlConfiguration.user,
            "port": this.mySqlConfiguration.port,
            "password": this.mySqlConfiguration.password,
            "database": this.mySqlConfiguration.database,
            "multipleStatements": this.mySqlConfiguration.multipleStatements
        });
        console.log("Database pool created");
    }

    public endSqlPool(callback: Function) {
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

    public queryPool(callback: Function, sql: string, closePool: boolean = false) {
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
                        // console.log("Connexion released");
                    });
                }
            }
        );
    }

    public getSqlConnexion() {
        return this.sqlConnexion;
    }

    public releaseSql() {
        if (this.sqlConnexion) {
            this.sqlConnexion.end(() => {
                if (this.sqlConnexion) {
                    this.log('Connexion to the database as id ' + this.sqlConnexion.threadId + ' ended !');
                }
            });
            this.sqlConnexion = null;
        }
    }

    private callbackConnect(err: any) {
        this.err = err;
        if (err) {
            console.error('error connecting: ' + err.stack);
            this.releaseSql();
            return;
        }
        if (this.sqlConnexion) {
            this.log('Connected to the database as id ' + this.sqlConnexion.threadId);
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
                passwordOk = comparePassword === user[this.mySqlConfiguration.passwordFieldName];
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
        this.connectSql();
        this.sqlConnexion.query(sql,
            (err: any, rows: any) => this.callbackQuerySql(callback, err, rows, releaseConnexion));
    }

    querySqlWithoutConnexion(callback: Function, sql: string) {
        this.sqlConnexion.query(sql,
            (err: any, rows: any) => callback(err, rows));
    }

    getJwt(callback: Function, login: string, password: string, where: string = null, jwtOptions: any = null, isPasswordCrypted = false) {
        this.connectSql();
        if (this.sqlConnexion) {
            let sql = "select * from " + this.mySqlConfiguration.userTableName + " where " + this.mySqlConfiguration.loginFieldName + " = '" + login + "'" + (where ? " and " + where : "");
            this.sqlConnexion.query(sql,
                (err: any, rows: any) => this.callbackGetJwt(callback, err, rows, password, jwtOptions, isPasswordCrypted));
        }
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
        this.connectSql();
    }

}