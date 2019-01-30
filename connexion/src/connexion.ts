import { decode } from 'punycode';
import { Toolbox } from "bdt105toolbox/dist";

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
    public emailFieldName: string;
    public applicationFieldName: string;
    public idFieldName: string;

    constructor(host: string, port: number, user: string, password: string, database: string, userTableName: string = null, idFieldName: string = null, loginFieldName: string = null, passwordFieldName: string = null, emailFieldName: string = null, applicationFieldName: string = null) {
        this.host = host;
        this.user = user;
        this.password = password;
        this.port = port;
        this.database = database;
        this.userTableName = userTableName;
        this.loginFieldName = loginFieldName;
        this.passwordFieldName = passwordFieldName;
        this.emailFieldName = passwordFieldName;
        this.applicationFieldName = applicationFieldName;
        this.idFieldName = idFieldName;
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

    public queryPool(callback: Function, sql: string) {
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

    private callbackGetJwt(callback: Function, err: any, rows: any, plainPassword: string) {
        this.rows = rows;
        this.err = err;
        let user: any = {};
        let jwt = null;
        this.releaseSql();
        if (rows && rows.length > 0) {
            let encryptedPassword = this.encrypt(plainPassword);
            user = rows[0];
            if (encryptedPassword === user[this.mySqlConfiguration.passwordFieldName]) {
                jwt = this.createJwt(user);
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

    private callbackQuerySql(callback: Function, err: any, rows: any) {
        this.releaseSql();

        if (callback) {
            callback(err, rows);
        }
    }

    querySql(callback: Function, sql: string) {
        this.connectSql();
        this.sqlConnexion.query(sql,
            (err: any, rows: any) => this.callbackQuerySql(callback, err, rows));
    }

    querySqlWithoutConnexion(callback: Function, sql: string) {
        this.sqlConnexion.query(sql,
            (err: any, rows: any) => callback(err, rows));
    }

    getJwt(callback: Function, login: string, plainPassword: string, where: string = null) {
        this.connectSql();
        if (this.sqlConnexion) {
            let sql = "select * from " + this.mySqlConfiguration.userTableName + " where " + this.mySqlConfiguration.loginFieldName + " = '" + login + "'" + (where ? " and " + where : "");
            this.sqlConnexion.query(sql,
                (err: any, rows: any) => this.callbackGetJwt(callback, err, rows, plainPassword));
        }
    }


    createJwt(data: any, options: any = null){
        return this.jsonwebtoken.sign(data, this.jwtConfiguration.secret, options);
    }
    
    checkJwt(token: string): Token {
        try {
            var decoded = this.jsonwebtoken.verify(token, this.jwtConfiguration.secret);
            if (decoded.iduser) {
                this.log("User Id: " + decoded.iduser + ", login: " + decoded.login);
            }
            return new Token(token, Connexion.jwtStatusOk, decoded);
        } catch (err) {
            return new Token(token, Connexion.jwtStatusERR, null);
        }
    }

    checkJwtWithField(token: string, field: string, value: string): Token {
        try {
            var decoded = this.jsonwebtoken.verify(token, this.jwtConfiguration.secret);
            if (decoded && decoded[field] == value) {
                this.log("User Id: " + decoded.iduser + ", login: " + decoded.login);
            }
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