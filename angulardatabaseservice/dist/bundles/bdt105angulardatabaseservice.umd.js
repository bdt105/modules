(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('@angular/core'), require('@angular/http'), require('bdt105toolbox/dist')) :
	typeof define === 'function' && define.amd ? define(['exports', '@angular/core', '@angular/http', 'bdt105toolbox/dist'], factory) :
	(factory((global.ng = global.ng || {}, global.ng.bdt105angulardatabaseservice = {}),global.ng.core,global.http,global.dist));
}(this, (function (exports,core,http,dist) { 'use strict';

var DatabaseService = /** @class */ (function () {
    function DatabaseService(http$$1) {
        this.http = http$$1;
        this.contentType = "application/json";
        this.toolbox = new dist.Toolbox();
        this.configuration = {
            "baseUrl": "http://editeur.vidal.fr/demo/apidb/demonstrationEditeur",
            "baseUrlOld": "http://localhost/apidb/demonstrationLocalhost",
            "sql": "/sql",
            "update": "/update",
            "read": "/read",
            "fresh": "/fresh",
            "structure": "/structure",
            "insert": "/insert",
            "save": "/save",
            "delete": "/delete",
            "fields": "/fields",
            "count": "/count"
        };
    }
    DatabaseService.prototype.setHeaders = function () {
        var auth = "Basic " + btoa(this.login + ":" + this.password);
        var headers = new http.Headers();
        headers.append("Authorization", auth);
        headers.append("Content-Type", "application/json");
        return headers;
    };
    DatabaseService.prototype.manageData = function (callback, data) {
        this.toolbox.log(data);
        if (data._body && (typeof data._body == "string")) {
            if (data._body.startsWith("<?xml version")) {
                data.json = this.toolbox.xml2json(data._body);
            }
            else {
                data.json = this.toolbox.parseJson(data._body);
            }
        }
        callback(data);
    };
    
    DatabaseService.prototype.manageError = function (callback, error) {
        console.log(error);
        callback(error);
    };
    
    DatabaseService.prototype.callPost = function (callbackSuccess, callbackFailure, url, body) {
        var _this = this;
        var headrs = this.setHeaders();
        this.toolbox.log(url);
        this.toolbox.log(body);
        this.toolbox.log(JSON.stringify(body));
        this.http.post(url, body, { headers: headrs }).subscribe(function (data) { return _this.manageData(callbackSuccess, data); }, function (error) { return _this.manageError(callbackFailure, error); });
    };
    DatabaseService.prototype.callGet = function (callbackSuccess, callbackFailure, url) {
        var _this = this;
        var headrs = this.setHeaders();
        this.toolbox.log(url);
        this.http.get(url, { headers: headrs }).subscribe(function (data) { return _this.manageData(callbackSuccess, data); }, function (error) { return _this.manageError(callbackFailure, error); });
    };
    DatabaseService.prototype.calll = function (callbackSuccess, callbackFailure, api, tableName, element) {
        if (tableName) {
            var url = this.configuration.baseUrl + api + "/" + tableName;
            this.callPost(callbackSuccess, callbackFailure, url, element);
        }
    };
    DatabaseService.prototype.connect = function (login, password) {
        this.login = login;
        this.password = password;
    };
    DatabaseService.prototype.sql = function (callbackSuccess, callbackFailure, sql, limit) {
        if (limit === void 0) { limit = "5000"; }
        var url = this.configuration.baseUrl + this.configuration.sql;
        var body = { "__sql": sql, "__limit": limit };
        this.callPost(callbackSuccess, callbackFailure, url, body);
    };
    DatabaseService.prototype.read = function (callbackSuccess, callbackFailure, tableName, element) {
        this.calll(callbackSuccess, callbackFailure, this.configuration.read, tableName, element);
    };
    DatabaseService.prototype.insert = function (callbackSuccess, callbackFailure, tableName, element) {
        this.calll(callbackSuccess, callbackFailure, this.configuration.insert, tableName, element);
    };
    
    DatabaseService.prototype.delete = function (callbackSuccess, callbackFailure, tableName, element) {
        this.calll(callbackSuccess, callbackFailure, this.configuration.delete, tableName, element);
    };
    
    DatabaseService.prototype.save = function (callbackSuccess, callbackFailure, tableName, element) {
        this.calll(callbackSuccess, callbackFailure, this.configuration.save, tableName, element);
    };
    
    DatabaseService.prototype.fields = function (callbackSuccess, callbackFailure, tableName) {
        this.calll(callbackSuccess, callbackFailure, this.configuration.fields, tableName);
    };
    
    DatabaseService.prototype.successNeww = function (data, callbackSuccess) {
        var fields = data.json.results;
        var newItem = {};
        for (var i = 0; i < fields.length; i++) {
            newItem[fields[i].Field] = "";
        }
        if (callbackSuccess) {
            callbackSuccess(newItem);
        }
    };
    DatabaseService.prototype.failureNeww = function (data, callbackFailure) {
        if (callbackFailure) {
            callbackFailure(data);
        }
    };
    DatabaseService.prototype.neww = function (callbackSuccess, callbackFailure, tableName) {
        var _this = this;
        this.fields(function (data) { return _this.successNeww(data, callbackSuccess); }, function (data) { return _this.failureNeww(data, callbackFailure); }, tableName);
    };
    DatabaseService.decorators = [
        { type: core.Injectable },
    ];
    /** @nocollapse */
    DatabaseService.ctorParameters = function () { return [
        { type: http.Http, },
    ]; };
    return DatabaseService;
}());

exports.DatabaseService = DatabaseService;

Object.defineProperty(exports, '__esModule', { value: true });

})));
