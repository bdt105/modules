"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Connexion = exports.Token = exports.JwtConfiguration = exports.SqlConfiguration = void 0;
var dist_1 = require("bdt105toolbox/dist");
var querystring_1 = require("querystring");
var SqlConfiguration = /** @class */ (function () {
    function SqlConfiguration() {
    }
    return SqlConfiguration;
}());
exports.SqlConfiguration = SqlConfiguration;
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
    function Connexion(sqlConfiguration, jwtConfiguration) {
        if (sqlConfiguration === void 0) { sqlConfiguration = null; }
        if (jwtConfiguration === void 0) { jwtConfiguration = null; }
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
    Connexion.prototype.log = function (text) {
        console.log(text);
    };
    Connexion.prototype.connectMySql = function () {
        var _this = this;
        this.mySqlConnexion = this.sqlDriver.createConnection({
            "host": this.sqlConfiguration.databaseServer,
            "user": this.sqlConfiguration.databaseUser,
            "port": this.sqlConfiguration.databasePort,
            "multipleStatements": this.sqlConfiguration.multipleStatements,
            "password": this.sqlConfiguration.databasePassword,
            "database": this.sqlConfiguration.databaseName
        });
        if (this.mySqlConnexion) {
            var err = this.mySqlConnexion.connect(function (err) { return _this.callbackConnect(err); });
        }
        return this.mySqlConnexion;
    };
    Connexion.prototype.createSqlPool = function () {
        if (this.sqlConfiguration.driver = 'mysql') {
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
        if (this.sqlConfiguration.driver = 'mssql') {
            this.msSqlPool = new this.sqlDriver.ConnectionPool({
                "server": this.sqlConfiguration.databaseServer,
                "database": this.sqlConfiguration.databaseName,
                "options": this.sqlConfiguration.options
            });
        }
    };
    Connexion.prototype.endSqlPool = function (callback) {
        var _this = this;
        if (this.sqlConfiguration.driver = 'mysql') {
            if (this.mySqlPool) {
                this.mySqlPool.end(function (err) {
                    if (err) {
                        _this.log("Error ending mysqlpool" + (0, querystring_1.stringify)(err));
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
        }
    };
    Connexion.prototype.queryPool = function (callback, sql, closePool) {
        if (closePool === void 0) { closePool = false; }
        if (this.sqlConfiguration.driver == 'mysql') {
            this.mySqlQueryPool(callback, sql, closePool);
        }
        if (this.sqlConfiguration.driver == 'mssql') {
            this.msSqlQueryPool(callback, sql, closePool);
        }
    };
    Connexion.prototype.msSqlQueryPool = function (callback, sql, closePool) {
        if (closePool === void 0) { closePool = false; }
        this.mssqlPoolRequest = this.msSqlPool.request();
        this.mssqlPoolRequest.query(sql, function (error, result) {
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
        });
    };
    Connexion.prototype.mySqlQueryPool = function (callback, sql, closePool) {
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
                                _this.log("queryPool - Error ending mysqlpool" + (0, querystring_1.stringify)(err));
                            }
                            else {
                                _this.log("queryPool - Mysql pool ended");
                            }
                        });
                    }
                });
            }
        });
    };
    /*
        private getSqlConnexion() {
            return this.sqlConfiguration.driver == 'mysql' ? this.mySqlConnexion : this.mssqlConnexionPool;
        }
    */
    Connexion.prototype.releaseSql = function () {
        var _this = this;
        if (this.sqlConfiguration.driver == 'mysql' && this.mySqlConnexion) {
            this.mySqlConnexion.end(function () {
                if (_this.mySqlConnexion) {
                    _this.log('Connexion to the database as id ' + _this.mySqlConnexion.threadId + ' ended !');
                }
            });
            this.mySqlConnexion = null;
        }
    };
    Connexion.prototype.callbackConnect = function (err) {
        this.err = err;
        if (err) {
            console.error('error connecting: ' + err.stack);
            this.releaseSql();
            return;
        }
        if (this.mySqlConnexion) {
            this.log('Connected to the database as id ' + this.mySqlConnexion.threadId);
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
        if (this.sqlConfiguration.driver == 'mysql') {
            this.connectMySql();
            this.mySqlConnexion.query(sql, function (err, rows) { return _this.callbackQuerySql(callback, err, rows, releaseConnexion); });
        }
        if (this.sqlConfiguration.driver == 'mssql') {
            this.msSqlQueryPool(function (err, rows) { return _this.callbackQuerySql(callback, err, rows, releaseConnexion); }, sql, releaseConnexion);
        }
    };
    Connexion.prototype.querySqlWithoutConnexion = function (callback, sql) {
        this.mySqlConnexion.query(sql, function (err, rows) { return callback(err, rows); });
    };
    Connexion.prototype.getJwt = function (callback, login, password, where, jwtOptions, isPasswordCrypted, releaseConnexion) {
        var _this = this;
        if (where === void 0) { where = null; }
        if (jwtOptions === void 0) { jwtOptions = null; }
        if (isPasswordCrypted === void 0) { isPasswordCrypted = false; }
        if (releaseConnexion === void 0) { releaseConnexion = true; }
        var sql = "select * from " + this.sqlConfiguration.userTableName + " where " + this.sqlConfiguration.loginFieldName + " = '" + login + "'" + (where ? " and " + where : "");
        this.querySql(function (err, rows) { return _this.callbackGetJwt(callback, err, rows, password, jwtOptions, isPasswordCrypted); }, sql, releaseConnexion);
        /*
                this.connectMySql();
                if (this.mySqlConnexion) {
                    let sql = "select * from " + this.sqlConfiguration.userTableName + " where " + this.sqlConfiguration.loginFieldName + " = '" + login + "'" + (where ? " and " + where : "");
                    this.mySqlConnexion.query(sql,
                        (err: any, rows: any) => this.callbackGetJwt(callback, err, rows, password, jwtOptions, isPasswordCrypted));
                }
        */
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
        this.connectMySql();
    };
    Connexion.prototype.checkToken = function (callback, token) {
        var ret = this.checkJwt(token);
        if (ret && ret.decoded) {
            ret.decoded.type = "standard";
            callback(ret, null);
        }
        else {
            this.checkGoogleApi(function (data, error) {
                if (data && data.json) {
                    data.json.type = "google";
                    var ret_2 = new Token(token, Connexion.jwtStatusOk, data.json);
                    callback(ret_2, null);
                }
                else {
                    callback(null, error);
                }
            }, token);
        }
    };
    Connexion.jwtStatusOk = "OK";
    Connexion.jwtStatusERR = "ERR";
    return Connexion;
}());
exports.Connexion = Connexion;
//# sourceMappingURL=connexion.js.map