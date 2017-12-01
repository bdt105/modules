(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('@angular/core'), require('bdt105angulardatabaseservice'), require('bdt105toolbox/dist'), require('bdt105vidal/dist')) :
	typeof define === 'function' && define.amd ? define(['exports', '@angular/core', 'bdt105angulardatabaseservice', 'bdt105toolbox/dist', 'bdt105vidal/dist'], factory) :
	(factory((global.ng = global.ng || {}, global.ng.bdt105angulardatabaseservice = {}),global.ng.core,global.bdt105angulardatabaseservice,global.dist,global.dist$1));
}(this, (function (exports,core,bdt105angulardatabaseservice,dist,dist$1) { 'use strict';

var ConnexionService = /** @class */ (function () {
    function ConnexionService(databaseService) {
        this.databaseService = databaseService;
        this.tableName = "user";
        this.toolbox = new dist.Toolbox();
        this.vidal = new dist$1.Vidal("dbd540aa", "8343650ea233a4716f524ab77dc24948");
        this.disconnect = function () {
            this.toolbox.removeFromStorage("connexion");
            this.connexion = null;
            return true;
        };
        this.getConnexion = function () {
            var conn = this.toolbox.readFromStorage("connexion");
            if (typeof conn == "object") {
                this.connexion = conn;
                return this.connexion;
            }
            else {
                return null;
            }
        };
    }
    ConnexionService.prototype.connectFake = function () {
        var callback = function () {
        };
        this.connect(callback, callback, "chlux", "chlux", true);
    };
    ConnexionService.prototype.connect = function (customCallBackSuccess, customCallBackFailure, login, password, rememberMe) {
        var _this = this;
        this.databaseService.login = login;
        this.databaseService.password = password;
        var where = "email='" + login + "' AND password='" + password + "'";
        var body = { "__where": where };
        this.databaseService.read(function (data) { return _this.success(customCallBackSuccess, rememberMe, data); }, function (data) { return _this.failure(customCallBackSuccess, customCallBackFailure, login, password, rememberMe, data); }, this.tableName, body);
    };
    
    ConnexionService.prototype.changeCurrentUserLang = function (lang) {
        if (this.connexion && this.connexion.currentUser) {
            this.connexion.currentUser.lang = lang;
            this.toolbox.writeToStorage("connexion", this.connexion, false);
        }
    };
    ConnexionService.prototype.success = function (customCallBackSuccess, rememberMe, data) {
        var currentUser = data.json.results[0];
        currentUser.login = currentUser.email;
        this.connexion = { "currentUser": currentUser };
        this.toolbox.writeToStorage("connexion", this.connexion, rememberMe);
        if (customCallBackSuccess !== null) {
            customCallBackSuccess(this.connexion);
        }
    };
    
    ConnexionService.prototype.successAfterLogin = function (customCallBackSuccess, login, password, rememberMe, data) {
        var currentUser = { "login": login, "password": password };
        this.connexion = { "currentUser": currentUser };
        this.toolbox.writeToStorage("connexion", this.connexion, rememberMe);
        if (customCallBackSuccess !== null) {
            customCallBackSuccess(this.connexion);
        }
    };
    ConnexionService.prototype.callbackAfterAfterLogin = function (data, error, customCallBackSuccess, login, password, rememberMe) {
        var currentUser = { "login": "editeurs@vidal.fr", "password": "editeurs", "lang": "FR", "country": "FR" };
        this.connexion = { "currentUser": currentUser };
        this.toolbox.writeToStorage("connexion", this.connexion, rememberMe);
        if (customCallBackSuccess !== null) {
            customCallBackSuccess(this.connexion);
        }
    };
    ConnexionService.prototype.failureAfterAfterLogin = function (data, customCallBackFailure) {
        this.disconnect();
        if (customCallBackFailure !== null) {
            customCallBackFailure(data);
        }
    };
    ConnexionService.prototype.failureAfterLogin = function (customCallBackSuccess, customCallBackFailure, login, password, rememberMe, data) {
        var params = [];
        var callback = function (data, error) {
            if (data) {
                this.callbackAfterAfterLogin(data, customCallBackSuccess, login, password, rememberMe);
            }
            if (error) {
                this.failureAfterAfterLogin(data, customCallBackFailure);
            }
        };
        this.vidal.getVersion(function (data, error) { return callback(data, error); }, params, "app_id=" + login + "&app_key=" + password);
    };
    ConnexionService.prototype.failure = function (customCallBackSuccess, customCallBackFailure, login, password, rememberMe, data) {
        this.failureAfterLogin(customCallBackSuccess, customCallBackFailure, login, password, rememberMe, data);
    };
    
    ConnexionService.decorators = [
        { type: core.Injectable },
    ];
    /** @nocollapse */
    ConnexionService.ctorParameters = function () { return [
        { type: bdt105angulardatabaseservice.DatabaseService, },
    ]; };
    return ConnexionService;
}());

exports.ConnexionService = ConnexionService;

Object.defineProperty(exports, '__esModule', { value: true });

})));
