var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Injectable } from '@angular/core';
import { Toolbox } from 'bdt105toolbox/dist';
import { Vidal } from 'bdt105vidal/dist';
var ConnexionService = /** @class */ (function () {
    function ConnexionService(databaseService) {
        this.databaseService = databaseService;
        this.tableName = "user";
        this.toolbox = new Toolbox();
        this.vidal = new Vidal("dbd540aa", "8343650ea233a4716f524ab77dc24948");
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
    ;
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
    ;
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
        var _this = this;
        var params = [];
        var callback = function (data, error) {
            if (data) {
                _this.callbackAfterAfterLogin(data, error, customCallBackSuccess, login, password, rememberMe);
            }
            if (error) {
                _this.failureAfterAfterLogin(data, customCallBackFailure);
            }
        };
        this.vidal.getVersion(function (data, error) { return callback(data, error); }, params, "app_id=" + login + "&app_key=" + password);
    };
    ConnexionService.prototype.failure = function (customCallBackSuccess, customCallBackFailure, login, password, rememberMe, data) {
        this.failureAfterLogin(customCallBackSuccess, customCallBackFailure, login, password, rememberMe, data);
    };
    ;
    ConnexionService = __decorate([
        Injectable()
    ], ConnexionService);
    return ConnexionService;
}());
export { ConnexionService };
//# sourceMappingURL=connexion.service.js.map