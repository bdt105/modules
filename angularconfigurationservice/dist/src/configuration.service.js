import { Injectable } from '@angular/core';
import { Toolbox } from 'bdt105toolbox/dist';
import { Http } from '@angular/http';
var ConfigurationService = /** @class */ (function () {
    function ConfigurationService(http) {
        this.http = http;
        this.toolbox = new Toolbox();
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
    ;
    ConfigurationService.prototype.manageError = function (callbackFailure, error) {
        console.log(error);
        if (callbackFailure) {
            callbackFailure(error);
        }
    };
    ;
    ConfigurationService.decorators = [
        { type: Injectable },
    ];
    /** @nocollapse */
    ConfigurationService.ctorParameters = function () { return [
        { type: Http, },
    ]; };
    return ConfigurationService;
}());
export { ConfigurationService };
//# sourceMappingURL=configuration.service.js.map