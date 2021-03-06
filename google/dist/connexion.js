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
        this.emailFieldName = passwordFieldName;
        this.applicationFieldName = applicationFieldName;
        this.idFieldName = idFieldName;
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
        this.toolbox = new dist_1.Toolbox();
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
            "password": this.mySqlConfiguration.password,
            "database": this.mySqlConfiguration.database
        });
        if (this.sqlConnexion) {
            let err = this.sqlConnexion.connect((err) => this.callbackConnect(err));
        }
    }
    releaseSql() {
        if (this.sqlConnexion) {
            this.log('Connexion to the database as id ' + this.sqlConnexion.threadId + ' ended !');
            this.sqlConnexion.end();
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
        this.log('Connected to the database as id ' + this.sqlConnexion.threadId);
    }
    callbackGetJwt(callback, err, rows, plainPassword) {
        this.rows = rows;
        this.err = err;
        let user = {};
        let jwt = null;
        this.releaseSql();
        if (rows && rows.length > 0) {
            let encryptedPassword = this.encrypt(plainPassword);
            user = rows[0];
            if (encryptedPassword === user[this.mySqlConfiguration.passwordFieldName]) {
                jwt = this.jsonwebtoken.sign(user, this.jwtConfiguration.secret);
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
    getJwt(callback, login, plainPassword, where = null) {
        this.connectSql();
        if (this.sqlConnexion) {
            let sql = "select * from " + this.mySqlConfiguration.userTableName + " where " + this.mySqlConfiguration.loginFieldName + " = '" + login + "'" + (where ? " and " + where : "");
            this.sqlConnexion.query(sql, (err, rows) => this.callbackGetJwt(callback, err, rows, plainPassword));
        }
    }
    checkJwt(token) {
        var jwt = require('jsonwebtoken');
        try {
            var decoded = jwt.verify(token, this.jwtConfiguration.secret);
            if (decoded.iduser) {
                this.log("User Id: " + decoded.iduser + ", login: " + decoded.login);
            }
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