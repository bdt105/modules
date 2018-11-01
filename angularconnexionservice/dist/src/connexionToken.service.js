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
import { Toolbox } from 'bdt105toolbox/dist';
import { Http } from '@angular/http';
var ConnexionTokenService = /** @class */ (function () {
    function ConnexionTokenService(http) {
        this.http = http;
        this.toolbox = new Toolbox();
        this.language = "FR";
        this.url = './assets/translate' + this.language + '.json';
        this.storageKey = "connexion";
        this.authentificationApiBaseUrl = "";
    }
    ConnexionTokenService.prototype.connect = function (callbackSuccess, callbackFailure, log, passwd, forever) {
        var _this = this;
        if (forever === void 0) { forever = false; }
        var body = {};
        body.login = log;
        body.password = passwd;
        this.http.post(this.authentificationApiBaseUrl + "get", body).subscribe(function (data) { return _this.connexionSuccess(callbackSuccess, data, forever); }, function (error) { return _this.connexionFailure(callbackFailure, error); });
        // Fake connexion
        // let fakeUser = this.getFakeUser();
    };
    ConnexionTokenService.prototype.connect2 = function (http, callbackSuccess, callbackFailure, log, passwd, forever) {
        var _this = this;
        if (forever === void 0) { forever = false; }
        var body = {};
        body.login = log;
        body.password = passwd;
        http.post(this.authentificationApiBaseUrl + "get", body).subscribe(function (data) { return _this.connexionSuccess(callbackSuccess, data, forever); }, function (error) { return _this.connexionFailure(callbackFailure, error); });
        // Fake connexion
        // let fakeUser = this.getFakeUser();
    };
    ConnexionTokenService.prototype.getFakeUser = function () {
        return {
            "iduser": 1,
            "lastName": "fake",
            "firstName": "fake"
        };
    };
    ConnexionTokenService.prototype.connexionSuccess = function (callback, data, forever) {
        var dat = JSON.parse(data._body);
        this.saveConnexion(data._body, forever);
        if (callback) {
            callback(data._body);
        }
    };
    ConnexionTokenService.prototype.connexionFailure = function (callback, error) {
        if (callback) {
            callback(error);
        }
    };
    ConnexionTokenService.prototype.disconnect = function () {
        this.removeConnexion();
    };
    ConnexionTokenService.prototype.isConnected = function (storageKey) {
        if (storageKey === void 0) { storageKey = ""; }
        var conn = this.get(storageKey);
        if (conn) {
            return conn.decoded != null;
        }
        else {
            return false;
        }
    };
    ConnexionTokenService.prototype.get = function (storageKey) {
        if (storageKey === void 0) { storageKey = ""; }
        return this.toolbox.readFromStorage(storageKey ? storageKey : this.storageKey);
    };
    ConnexionTokenService.prototype.getToken = function (storageKey) {
        if (storageKey === void 0) { storageKey = ""; }
        var conn = this.get(storageKey);
        if (conn) {
            return conn.token;
        }
        return null;
    };
    ConnexionTokenService.prototype.saveConnexion = function (connexion, forever) {
        if (forever === void 0) { forever = false; }
        this.toolbox.writeToStorage(this.storageKey, connexion, forever);
    };
    ConnexionTokenService.prototype.removeConnexion = function () {
        this.toolbox.removeFromStorage(this.storageKey);
    };
    ConnexionTokenService.prototype.getUser = function (storageKey) {
        if (storageKey === void 0) { storageKey = ""; }
        var conn = this.get(storageKey);
        if (conn && conn.decoded) {
            return conn.decoded;
        }
        return null;
    };
    ConnexionTokenService = __decorate([
        Injectable(),
        __param(0, Inject(Http))
    ], ConnexionTokenService);
    return ConnexionTokenService;
}());
export { ConnexionTokenService };
//# sourceMappingURL=connexionToken.service.js.map