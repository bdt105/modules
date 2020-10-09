"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Connexion = exports.Token = exports.JwtConfiguration = exports.MySqlConfiguration = void 0;
var dist_1 = require("bdt105toolbox/dist");
var querystring_1 = require("querystring");
var MySqlConfiguration = /** @class */ (function () {
    function MySqlConfiguration(host, port, user, password, database, userTableName, idFieldName, loginFieldName, passwordFieldName, emailFieldName, applicationFieldName) {
        if (userTableName === void 0) { userTableName = null; }
        if (idFieldName === void 0) { idFieldName = null; }
        if (loginFieldName === void 0) { loginFieldName = null; }
        if (passwordFieldName === void 0) { passwordFieldName = null; }
        if (emailFieldName === void 0) { emailFieldName = null; }
        if (applicationFieldName === void 0) { applicationFieldName = null; }
        this.host = host;
        this.user = user;
        this.password = password;
        this.port = port;
        this.database = database;
        this.userTableName = userTableName;
        this.loginFieldName = loginFieldName;
        this.passwordFieldName = passwordFieldName;
    }
    return MySqlConfiguration;
}());
exports.MySqlConfiguration = MySqlConfiguration;
var JwtConfiguration = /** @class */ (function () {
    function JwtConfiguration(secret, salt, userRequestEmail, adminToken) {
        this.secret = secret;
        this.salt = salt;
        this.userRequestEmail = userRequestEmail;
        this.adminToken = adminToken;
    }
    return JwtConfiguration;
}());
exports.JwtConfiguration = JwtConfiguration;
var Token = /** @class */ (function () {
    function Token(token, status, decoded) {
        this.token = token;
        this.status = status;
        this.decoded = decoded;
    }
    return Token;
}());
exports.Token = Token;
var Connexion = /** @class */ (function () {
    function Connexion(mySqlConfiguration, jwtConfiguration) {
        if (mySqlConfiguration === void 0) { mySqlConfiguration = null; }
        if (jwtConfiguration === void 0) { jwtConfiguration = null; }
        this.rest = new dist_1.Rest();
        this.mySqlConfiguration = mySqlConfiguration;
        this.jwtConfiguration = jwtConfiguration;
        this.mySql = require('mysql');
        this.jsonwebtoken = require('jsonwebtoken');
    }
    Connexion.prototype.log = function (text) {
        console.log(text);
    };
    Connexion.prototype.connectSql = function () {
        var _this = this;
        this.sqlConnexion = this.mySql.createConnection({
            "host": this.mySqlConfiguration.host,
            "user": this.mySqlConfiguration.user,
            "port": this.mySqlConfiguration.port,
            "multipleStatements": this.mySqlConfiguration.multipleStatements,
            "password": this.mySqlConfiguration.password,
            "database": this.mySqlConfiguration.database
        });
        if (this.sqlConnexion) {
            var err = this.sqlConnexion.connect(function (err) { return _this.callbackConnect(err); });
        }
        return this.sqlConnexion;
    };
    Connexion.prototype.createSqlPool = function () {
        this.mySqlPool = this.mySql.createPool({
            "host": this.mySqlConfiguration.host,
            "user": this.mySqlConfiguration.user,
            "port": this.mySqlConfiguration.port,
            "password": this.mySqlConfiguration.password,
            "database": this.mySqlConfiguration.database,
            "multipleStatements": this.mySqlConfiguration.multipleStatements
        });
        console.log("Database pool created");
    };
    Connexion.prototype.endSqlPool = function (callback) {
        var _this = this;
        if (this.mySqlPool) {
            this.mySqlPool.end(function (err) {
                if (err) {
                    _this.log("Error ending mysqlpool" + querystring_1.stringify(err));
                }
                else {
                    _this.log("Mysql pool ended");
                }
                callback(err);
            });
        }
        else {
            this.log("Mysql pool NOT ended because undefined");
        }
    };
    Connexion.prototype.queryPool = function (callback, sql, closePool) {
        var _this = this;
        if (closePool === void 0) { closePool = false; }
        if (!this.mySqlPool) {
            this.createSqlPool();
        }
        this.mySqlPool.getConnection(function (error, connection) {
            if (error) {
                callback(error, null);
            }
            else {
                connection.query(sql, function (err, rows) {
                    callback(err, rows);
                    connection.release();
                    if (closePool) {
                        _this.endSqlPool(function (err) {
                            if (err) {
                                _this.log("queryPool - Error ending mysqlpool" + querystring_1.stringify(err));
                            }
                            else {
                                _this.log("queryPool - Mysql pool ended");
                            }
                        });
                    }
                    // console.log("Connexion released");
                });
            }
        });
    };
    Connexion.prototype.getSqlConnexion = function () {
        return this.sqlConnexion;
    };
    Connexion.prototype.releaseSql = function () {
        var _this = this;
        if (this.sqlConnexion) {
            this.sqlConnexion.end(function () {
                if (_this.sqlConnexion) {
                    _this.log('Connexion to the database as id ' + _this.sqlConnexion.threadId + ' ended !');
                }
            });
            this.sqlConnexion = null;
        }
    };
    Connexion.prototype.callbackConnect = function (err) {
        this.err = err;
        if (err) {
            console.error('error connecting: ' + err.stack);
            this.releaseSql();
            return;
        }
        if (this.sqlConnexion) {
            this.log('Connected to the database as id ' + this.sqlConnexion.threadId);
        }
    };
    Connexion.prototype.callbackGetJwt = function (callback, err, rows, password, jwtOptions, isPasswordCrypted) {
        this.rows = rows;
        this.err = err;
        var user = {};
        var jwt = null;
        this.releaseSql();
        if (rows && rows.length > 0) {
            var passwordOk = true;
            user = rows[0];
            if (password != null) {
                var comparePassword = isPasswordCrypted ? password : this.encrypt(password);
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
    };
    Connexion.prototype.callbackQuerySql = function (callback, err, rows, releaseConnexion) {
        if (releaseConnexion === void 0) { releaseConnexion = true; }
        if (releaseConnexion) {
            this.releaseSql();
        }
        if (callback) {
            callback(err, rows);
        }
    };
    Connexion.prototype.querySql = function (callback, sql, releaseConnexion) {
        var _this = this;
        if (releaseConnexion === void 0) { releaseConnexion = false; }
        this.connectSql();
        this.sqlConnexion.query(sql, function (err, rows) { return _this.callbackQuerySql(callback, err, rows, releaseConnexion); });
    };
    Connexion.prototype.querySqlWithoutConnexion = function (callback, sql) {
        this.sqlConnexion.query(sql, function (err, rows) { return callback(err, rows); });
    };
    Connexion.prototype.getJwt = function (callback, login, password, where, jwtOptions, isPasswordCrypted) {
        var _this = this;
        if (where === void 0) { where = null; }
        if (jwtOptions === void 0) { jwtOptions = null; }
        if (isPasswordCrypted === void 0) { isPasswordCrypted = false; }
        this.connectSql();
        if (this.sqlConnexion) {
            var sql = "select * from " + this.mySqlConfiguration.userTableName + " where " + this.mySqlConfiguration.loginFieldName + " = '" + login + "'" + (where ? " and " + where : "");
            this.sqlConnexion.query(sql, function (err, rows) { return _this.callbackGetJwt(callback, err, rows, password, jwtOptions, isPasswordCrypted); });
        }
    };
    Connexion.prototype.createJwt = function (data, options) {
        if (options === void 0) { options = null; }
        var payload = JSON.parse(JSON.stringify(data));
        return this.jsonwebtoken.sign(payload, this.jwtConfiguration.secret, options);
    };
    Connexion.prototype.checkJwt = function (token) {
        try {
            var decoded = this.jsonwebtoken.verify(token, this.jwtConfiguration.secret);
            if (decoded) {
                return new Token(token, Connexion.jwtStatusOk, decoded);
            }
        }
        catch (err) {
            return new Token(token, Connexion.jwtStatusERR, null);
        }
    };
    Connexion.prototype.checkGoogleApi = function (callback, token) {
        this.rest.call(function (data, error) {
            callback(data, error);
        }, "POST", "https://www.googleapis.com/oauth2/v1/tokeninfo?access_token=" + token);
    };
    Connexion.prototype.decryptToken = function (callback, token) {
        var ret = this.checkJwt(token);
        if (ret && ret.decoded) {
            ret.decoded.type = "standard";
            callback(ret, null);
        }
        else {
            this.checkGoogleApi(function (data, error) {
                if (data && data.json) {
                    data.json.type = "google";
                    var ret_1 = new Token(token, Connexion.jwtStatusOk, data.json);
                    callback(ret_1, null);
                }
                else {
                    callback(null, error);
                }
            }, token);
        }
    };
    Connexion.prototype.checkJwtWithField = function (token, field, value) {
        try {
            var decoded = this.jsonwebtoken.verify(token, this.jwtConfiguration.secret);
            return new Token(token, Connexion.jwtStatusOk, decoded);
        }
        catch (err) {
            return new Token(token, Connexion.jwtStatusERR, null);
        }
    };
    Connexion.prototype.isTokenValid = function (token) {
        var jwt = this.checkJwt(token);
        if (jwt) {
            return jwt.status == Connexion.jwtStatusOk;
        }
        else {
            return false;
        }
    };
    Connexion.prototype.encrypt = function (plain) {
        var bcrypt = require('bcryptjs');
        var hash = bcrypt.hashSync(plain, this.jwtConfiguration.salt);
        return hash;
    };
    Connexion.prototype.compareEncrypt = function (encrypted, plain) {
        var bcrypt = require('bcryptjs');
        var hash = bcrypt.hashSync(plain, this.jwtConfiguration.salt);
        return hash === encrypted;
    };
    Connexion.prototype.tryConnectSql = function () {
        this.connectSql();
    };
    Connexion.jwtStatusOk = "OK";
    Connexion.jwtStatusERR = "ERR";
    return Connexion;
}());
exports.Connexion = Connexion;
//# sourceMappingURL=connexion.js.map