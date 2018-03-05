(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('@angular/core'), require('bdt105toolbox/dist'), require('@angular/http')) :
	typeof define === 'function' && define.amd ? define(['exports', '@angular/core', 'bdt105toolbox/dist', '@angular/http'], factory) :
	(factory((global.ng = global.ng || {}, global.ng.bdt105angularconfigurationservice = {}),global.ng.core,global.dist,global.http));
}(this, (function (exports,core,dist,http) { 'use strict';

var ConfigurationService = /** @class */ (function () {
    function ConfigurationService(http$$1) {
        this.http = http$$1;
        this.toolbox = new dist.Toolbox();
        this.url = './assets/configuration.json';
        this.storageKey = "configuration";
        var callback = function () {
        };
        this.init(callback, callback);
    }
    ConfigurationService.prototype.load = function () {
        var _this = this;
        return new Promise(function (resolve) {
            var conf = _this.get();
            if (!conf) {
                setTimeout(function () {
                    console.log('hello world');
                    resolve(true);
                }, 2000);
            }
            else {
                resolve(true);
            }
        });
    };
    ConfigurationService.prototype.get = function () {
        this.data = this.toolbox.readFromStorage(this.storageKey);
        if (this.data) {
            return this.data;
        }
        return null;
    };
    ConfigurationService.prototype.init = function (callbackSuccess, callbackFailure) {
        var _this = this;
        this.http.get(this.url).subscribe(function (data) { return _this.manageData(callbackSuccess, data); }, function (error) { return _this.manageError(callbackFailure, error); });
    };
    ConfigurationService.prototype.manageData = function (callbackSuccess, data) {
        this.toolbox.log(data);
        this.data = this.toolbox.parseJson(data._body);
        this.toolbox.writeToStorage(this.storageKey, this.data, false);
        if (callbackSuccess) {
            callbackSuccess(this.data);
        }
    };
    ConfigurationService.prototype.manageError = function (callbackFailure, error) {
        console.log(error);
        if (callbackFailure) {
            callbackFailure(error);
        }
    };
    ConfigurationService.decorators = [
        { type: core.Injectable },
    ];
    /** @nocollapse */
    ConfigurationService.ctorParameters = function () { return [
        { type: http.Http, },
    ]; };
    return ConfigurationService;
}());

exports.ConfigurationService = ConfigurationService;

Object.defineProperty(exports, '__esModule', { value: true });

})));
