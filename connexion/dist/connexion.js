"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const dist_1 = require("bdt105toolbox/dist");
class MySqlConfiguration {
    constructor(host, port, user, password, database, userTableName = null, idFieldName = null, loginFieldName = null, passwordFieldName = null, emailFieldName = null, applicationFieldName = null) {
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
exports.MySqlConfiguration = MySqlConfiguration;
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
    constructor(mySqlConfiguration = null, jwtConfiguration = null) {
        this.rest = new dist_1.Rest();
        this.mySqlConfiguration = mySqlConfiguration;
        this.jwtConfiguration = jwtConfiguration;
        this.mySql = require('mysql');
        this.jsonwebtoken = require('jsonwebtoken');
    }
    log(text) {
        console.log(text);
    }
    connectSql() {
        this.sqlConnexion = this.mySql.createConnection({
            "host": this.mySqlConfiguration.host,
            "user": this.mySqlConfiguration.user,
            "port": this.mySqlConfiguration.port,
            "multipleStatements": this.mySqlConfiguration.multipleStatements,
            "password": this.mySqlConfiguration.password,
            "database": this.mySqlConfiguration.database
        });
        if (this.sqlConnexion) {
            let err = this.sqlConnexion.connect((err) => this.callbackConnect(err));
        }
        return this.sqlConnexion;
    }
    createSqlPool() {
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
    queryPool(callback, sql) {
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
                    // console.log("Connexion released");
                });
            }
        });
    }
    getSqlConnexion() {
        return this.sqlConnexion;
    }
    releaseSql() {
        if (this.sqlConnexion) {
            this.sqlConnexion.end(() => {
                if (this.sqlConnexion) {
                    this.log('Connexion to the database as id ' + this.sqlConnexion.threadId + ' ended !');
                }
            });
            this.sqlConnexion = null;
        }
    }
    callbackConnect(err) {
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
                passwordOk = comparePassword === user[this.mySqlConfiguration.passwordFieldName];
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
    callbackQuerySql(callback, err, rows) {
        this.releaseSql();
        if (callback) {
            callback(err, rows);
        }
    }
    querySql(callback, sql) {
        this.connectSql();
        this.sqlConnexion.query(sql, (err, rows) => this.callbackQuerySql(callback, err, rows));
    }
    querySqlWithoutConnexion(callback, sql) {
        this.sqlConnexion.query(sql, (err, rows) => callback(err, rows));
    }
    getJwt(callback, login, password, where = null, jwtOptions = null, isPasswordCrypted = false) {
        this.connectSql();
        if (this.sqlConnexion) {
            let sql = "select * from " + this.mySqlConfiguration.userTableName + " where " + this.mySqlConfiguration.loginFieldName + " = '" + login + "'" + (where ? " and " + where : "");
            this.sqlConnexion.query(sql, (err, rows) => this.callbackGetJwt(callback, err, rows, password, jwtOptions, isPasswordCrypted));
        }
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
        this.connectSql();
    }
}
Connexion.jwtStatusOk = "OK";
Connexion.jwtStatusERR = "ERR";
exports.Connexion = Connexion;
//# sourceMappingURL=connexion.js.map