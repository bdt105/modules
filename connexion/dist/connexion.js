"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Connexion = exports.Token = exports.JwtConfiguration = exports.SqlConfiguration = void 0;
const dist_1 = require("bdt105toolbox/dist");
const querystring_1 = require("querystring");
class SqlConfiguration {
}
exports.SqlConfiguration = SqlConfiguration;
class JwtConfiguration {
    constructor(secret, salt, userRequestEmail, adminToken) {
        this.secret = secret;
        this.salt = salt;
        this.userRequestEmail = userRequestEmail;
        this.adminToken = adminToken;
    }
}
exports.JwtConfiguration = JwtConfiguration;
class Token {
    constructor(token, status, decoded) {
        this.token = token;
        this.status = status;
        this.decoded = decoded;
    }
}
exports.Token = Token;
class Connexion {
    constructor(sqlConfiguration = null, jwtConfiguration = null) {
        this.rest = new dist_1.Rest();
        this.sqlConfiguration = sqlConfiguration;
        this.jwtConfiguration = jwtConfiguration;
        if (sqlConfiguration.driver == 'mssql') {
            this.sqlDriver = require("mssql/msnodesqlv8");
        }
        else {
            this.sqlDriver = require('mysql');
        }
        this.jsonwebtoken = require('jsonwebtoken');
    }
    log(text) {
        console.log(text);
    }
    connectMySql() {
        this.mySqlConnexion = this.sqlDriver.createConnection({
            "host": this.sqlConfiguration.databaseServer,
            "user": this.sqlConfiguration.databaseUser,
            "port": this.sqlConfiguration.databasePort,
            "multipleStatements": this.sqlConfiguration.multipleStatements,
            "password": this.sqlConfiguration.databasePassword,
            "database": this.sqlConfiguration.databaseName
        });
        if (this.mySqlConnexion) {
            let err = this.mySqlConnexion.connect((err) => this.callbackConnect(err));
        }
        return this.mySqlConnexion;
    }
    createSqlPool() {
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
    endSqlPool(callback) {
        if (this.sqlConfiguration.driver == 'mysql') {
            if (this.mySqlPool) {
                this.mySqlPool.end((err) => {
                    if (err) {
                        this.log("Error ending mysqlpool" + (0, querystring_1.stringify)(err));
                    }
                    else {
                        this.log("Mysql pool ended");
                    }
                    callback(err);
                });
            }
            else {
                this.log("Mysql pool NOT ended because undefined");
            }
        }
        if (this.sqlConfiguration.driver == 'mssql') {
            if (this.msSqlPool) {
                this.msSqlPool.close();
                this.log("Mssql pool closed");
                callback(null);
            }
        }
    }
    queryPool(callback, sql, closePool = false) {
        if (this.sqlConfiguration.driver == 'mysql') {
            this.mySqlQueryPool(callback, sql, closePool);
        }
        if (this.sqlConfiguration.driver == 'mssql') {
            this.msSqlQueryPool(callback, sql, closePool);
        }
    }
    msSqlQueryPool(callback, sql, closePool = false) {
        if (!this.msSqlPool) {
            this.createSqlPool();
        }
        this.msSqlPool.connect().then((pool) => {
            let poolRequest = pool.request();
            poolRequest.query(sql, (error, result) => {
                if (error) {
                    callback(error, null);
                }
                else {
                    if (result && result.recordset) {
                        callback(null, result.recordset);
                    }
                    else {
                        callback(null, result);
                    }
                }
                if (closePool) {
                    this.endSqlPool((err) => {
                        this.log("queryPool - Mssql pool ended");
                    });
                }
            });
        });
    }
    mySqlQueryPool(callback, sql, closePool = false) {
        if (!this.mySqlPool) {
            this.createSqlPool();
        }
        this.mySqlPool.getConnection((error, connection) => {
            if (error) {
                callback(error, null);
            }
            else {
                connection.query(sql, (err, rows) => {
                    callback(err, rows);
                    connection.release();
                    if (closePool) {
                        this.endSqlPool((err) => {
                            if (err) {
                                this.log("queryPool - Error ending mysqlpool" + (0, querystring_1.stringify)(err));
                            }
                            else {
                                this.log("queryPool - Mysql pool ended");
                            }
                        });
                    }
                });
            }
        });
    }
    /*
        private getSqlConnexion() {
            return this.sqlConfiguration.driver == 'mysql' ? this.mySqlConnexion : this.mssqlConnexionPool;
        }
    */
    releaseSql() {
        if (this.sqlConfiguration.driver == 'mysql' && this.mySqlConnexion) {
            this.mySqlConnexion.end(() => {
                if (this.mySqlConnexion) {
                    this.log('Connexion to the database as id ' + this.mySqlConnexion.threadId + ' ended !');
                }
            });
            this.mySqlConnexion = null;
        }
    }
    callbackConnect(err) {
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
    callbackGetJwt(callback, err, rows, password, jwtOptions, isPasswordCrypted) {
        this.rows = rows;
        this.err = err;
        let user = {};
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
            }
            else {
                callback("Wrong password or login", jwt);
            }
        }
        else {
            if (callback) {
                callback(err, jwt);
            }
        }
    }
    callbackQuerySql(callback, err, rows, releaseConnexion = true) {
        if (releaseConnexion) {
            this.releaseSql();
        }
        if (callback) {
            callback(err, rows);
        }
    }
    querySql(callback, sql, releaseConnexion = false) {
        if (this.sqlConfiguration.driver == 'mysql') {
            this.connectMySql();
            this.mySqlConnexion.query(sql, (err, rows) => this.callbackQuerySql(callback, err, rows, releaseConnexion));
        }
        if (this.sqlConfiguration.driver == 'mssql') {
            this.msSqlQueryPool((err, rows) => this.callbackQuerySql(callback, err, rows, releaseConnexion), sql, releaseConnexion);
        }
    }
    querySqlWithoutConnexion(callback, sql) {
        this.mySqlConnexion.query(sql, (err, rows) => callback(err, rows));
    }
    getJwt(callback, login, password, where = null, jwtOptions = null, isPasswordCrypted = false, releaseConnexion = true) {
        let sql = "select * from " + this.sqlConfiguration.userTableName + " where " + this.sqlConfiguration.loginFieldName + " = '" + login + "'" + (where ? " and " + where : "");
        this.querySql((err, rows) => this.callbackGetJwt(callback, err, rows, password, jwtOptions, isPasswordCrypted), sql, releaseConnexion);
        /*
                this.connectMySql();
                if (this.mySqlConnexion) {
                    let sql = "select * from " + this.sqlConfiguration.userTableName + " where " + this.sqlConfiguration.loginFieldName + " = '" + login + "'" + (where ? " and " + where : "");
                    this.mySqlConnexion.query(sql,
                        (err: any, rows: any) => this.callbackGetJwt(callback, err, rows, password, jwtOptions, isPasswordCrypted));
                }
        */
    }
    createJwt(data, options = null) {
        let payload = JSON.parse(JSON.stringify(data));
        return this.jsonwebtoken.sign(payload, this.jwtConfiguration.secret, options);
    }
    checkJwt(token) {
        try {
            var decoded = this.jsonwebtoken.verify(token, this.jwtConfiguration.secret);
            if (decoded) {
                return new Token(token, Connexion.jwtStatusOk, decoded);
            }
        }
        catch (err) {
            return new Token(token, Connexion.jwtStatusERR, null);
        }
    }
    checkGoogleApi(callback, token) {
        this.rest.call((data, error) => {
            callback(data, error);
        }, "POST", "https://www.googleapis.com/oauth2/v1/tokeninfo?access_token=" + token);
    }
    decryptToken(callback, token) {
        let ret = this.checkJwt(token);
        if (ret && ret.decoded) {
            ret.decoded.type = "standard";
            callback(ret, null);
        }
        else {
            this.checkGoogleApi((data, error) => {
                if (data && data.json) {
                    data.json.type = "google";
                    let ret = new Token(token, Connexion.jwtStatusOk, data.json);
                    callback(ret, null);
                }
                else {
                    callback(null, error);
                }
            }, token);
        }
    }
    checkJwtWithField(token, field, value) {
        try {
            var decoded = this.jsonwebtoken.verify(token, this.jwtConfiguration.secret);
            return new Token(token, Connexion.jwtStatusOk, decoded);
        }
        catch (err) {
            return new Token(token, Connexion.jwtStatusERR, null);
        }
    }
    isTokenValid(token) {
        let jwt = this.checkJwt(token);
        if (jwt) {
            return jwt.status == Connexion.jwtStatusOk;
        }
        else {
            return false;
        }
    }
    encrypt(plain) {
        var bcrypt = require('bcryptjs');
        var hash = bcrypt.hashSync(plain, this.jwtConfiguration.salt);
        return hash;
    }
    compareEncrypt(encrypted, plain) {
        var bcrypt = require('bcryptjs');
        var hash = bcrypt.hashSync(plain, this.jwtConfiguration.salt);
        return hash === encrypted;
    }
    tryConnectSql() {
        this.connectMySql();
    }
    checkToken(callback, token) {
        let ret = this.checkJwt(token);
        if (ret && ret.decoded) {
            ret.decoded.type = "standard";
            callback(ret, null);
        }
        else {
            this.checkGoogleApi((data, error) => {
                if (data && data.json) {
                    data.json.type = "google";
                    let ret = new Token(token, Connexion.jwtStatusOk, data.json);
                    callback(ret, null);
                }
                else {
                    callback(null, error);
                }
            }, token);
        }
    }
}
exports.Connexion = Connexion;
//private mssqlPoolRequest: any;
Connexion.jwtStatusOk = "OK";
Connexion.jwtStatusERR = "ERR";
//# sourceMappingURL=connexion.js.map