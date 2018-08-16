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
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { Toolbox } from 'bdt105toolbox/dist';
var ConfigurationService = /** @class */ (function () {
    function ConfigurationService(http) {
        this.http = http;
        this.toolbox = new Toolbox();
    }
    ConfigurationService.prototype.get = function (localStorageKey) {
        if (localStorageKey === void 0) { localStorageKey = "configuration"; }
        return this.toolbox.readFromStorage(localStorageKey);
    };
    ConfigurationService.prototype.load = function (localStorageKey, fileUrl, forever) {
        var _this = this;
        if (localStorageKey === void 0) { localStorageKey = "configuration"; }
        if (fileUrl === void 0) { fileUrl = "./assets/configuration.json"; }
        if (forever === void 0) { forever = false; }
        console.log("loading ..." + localStorageKey);
        if (!this.data) {
            this.data = [];
        }
        return new Promise(function (resolve, reject) {
            _this.http
                .get(fileUrl)
                .map(function (res) { return res.json(); })
                .subscribe(function (response) {
                _this.data[localStorageKey] = response;
                _this.toolbox.writeToStorage(localStorageKey, response, forever);
                console.log(localStorageKey + " loading complete", _this.data);
                resolve(true);
            });
        });
    };
    ConfigurationService.prototype.loadAutonomous = function (fileUrl, forever) {
        var _this = this;
        if (fileUrl === void 0) { fileUrl = "./assets/configuration.json"; }
        if (forever === void 0) { forever = false; }
        console.log("loading ...");
        if (!this.data) {
            this.data = [];
        }
        return new Promise(function (resolve, reject) {
            _this.http
                .get(fileUrl)
                .map(function (res) { return res.json(); })
                .subscribe(function (response) {
                var localStorageKey = response.common.configurationStorageKey;
                _this.data[localStorageKey] = response;
                _this.toolbox.writeToStorage(localStorageKey, response, forever);
                console.log(localStorageKey + " loading complete", _this.data);
                resolve(true);
            });
        });
    };
    ConfigurationService = __decorate([
        Injectable(),
        __param(0, Inject(Http))
    ], ConfigurationService);
    return ConfigurationService;
}());
export { ConfigurationService };
//# sourceMappingURL=configuration.service.js.map