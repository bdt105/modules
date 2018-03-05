var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
import { Injectable, Inject } from '@angular/core';
import { DatabaseService } from 'bdt105angulardatabaseservice';
import { Toolbox } from 'bdt105toolbox/dist';
var ConnexionService = /** @class */ (function () {
    function ConnexionService(databaseService) {
        this.databaseService = databaseService;
        this.tableName = "user";
        this.toolbox = new Toolbox();
    }
    ConnexionService.prototype.connectFake = function () {
        var callback = function () {
        };
        this.connect(callback, callback, "chlux", "chlux", true);
    };
    ConnexionService.prototype.disconnect = function () {
        this.toolbox.removeFromStorage("connexion");
        this.connexion = null;
        return true;
    };
    ;
    ConnexionService.prototype.get = function () {
        var conn = this.toolbox.readFromStorage("connexion");
        if (typeof conn == "object") {
            this.connexion = conn;
            return this.connexion;
        }
        else {
            return null;
        }
    };
    ;
    ConnexionService.prototype.save = function (connexion, rememberMe) {
        if (connexion === void 0) { connexion = null; }
        if (rememberMe === void 0) { rememberMe = false; }
        if (connexion) {
            this.connexion = connexion;
        }
        this.toolbox.writeToStorage("connexion", this.connexion, rememberMe);
    };
    ConnexionService.prototype.connect = function (customCallBackSuccess, customCallBackFailure, login, password, rememberMe) {
        var _this = this;
        this.databaseService.login = login;
        this.databaseService.password = password;
        var where = "email='" + login + "' AND password='" + password + "'";
        var body = { "__where": where };
        this.databaseService.read(function (data) { return _this.success(customCallBackSuccess, rememberMe, data); }, function (data) { return _this.failure(customCallBackSuccess, data); }, this.tableName, body);
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
    ConnexionService.prototype.failure = function (customCallBackFailure, data) {
        this.disconnect();
        if (customCallBackFailure !== null) {
            customCallBackFailure(data);
        }
    };
    ConnexionService.prototype.getUser = function () {
        var conn = this.get();
        if (conn && conn.currentUser) {
            return conn.currentUser;
        }
        return null;
    };
    ConnexionService.prototype.getCurrentUser = function () {
        return this.getUser();
    };
    ConnexionService.prototype.isConnected = function () {
        var conn = this.get();
        if (conn && conn.currentUser) {
            return true;
        }
        return false;
    };
    ConnexionService = __decorate([
        Injectable(),
        __param(0, Inject(DatabaseService))
    ], ConnexionService);
    return ConnexionService;
}());
export { ConnexionService };
//# sourceMappingURL=connexion.service.js.map