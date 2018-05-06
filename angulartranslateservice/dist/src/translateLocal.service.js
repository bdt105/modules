var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Injectable } from '@angular/core';
import { Toolbox } from 'bdt105toolbox/dist';
import { Http } from '@angular/http';
var TranslateLocalService = /** @class */ (function () {
    function TranslateLocalService(http) {
        this.http = http;
        this.toolbox = new Toolbox();
        this.storageKey = "translate";
        this.baseUrl = "./assets/";
    }
    TranslateLocalService.prototype.get = function () {
        this.data = this.toolbox.readFromStorage(this.storageKey);
        if (this.data) {
            return this.data;
        }
        return null;
    };
    TranslateLocalService.prototype.load = function () {
        var _this = this;
        return new Promise(function (resolve) {
            var trans = _this.get();
            if (!trans) {
                setTimeout(function () {
                    console.log('Translation loaded ?!');
                    resolve(true);
                }, 2000);
            }
            else {
                resolve(true);
            }
        });
    };
    TranslateLocalService.prototype.translate = function (text) {
        this.currentText = text;
        this.translateData = this.toolbox.readFromStorage(this.storageKey);
        if (this.translateData) {
            var t = this.toolbox.filterArrayOfObjects(this.translateData, "key", text);
            if (t && t.length > 0) {
                return t[0].value;
            }
        }
        return text;
    };
    TranslateLocalService.prototype.init = function (callbackSuccess, callbackFailure, fileUrl, storageKey) {
        var _this = this;
        if (fileUrl && storageKey) {
            this.url = fileUrl;
            this.storageKey = storageKey;
            this.http.get(this.url).subscribe(function (data) { return _this.manageData(callbackSuccess, data); }, function (error) { return _this.manageError(callbackFailure, error); });
        }
    };
    TranslateLocalService.prototype.manageData = function (callbackSuccess, data) {
        this.toolbox.log(data);
        this.translateData = this.toolbox.parseJson(data._body);
        this.toolbox.writeToStorage(this.storageKey, this.translateData, false);
        if (callbackSuccess) {
            callbackSuccess(this.data);
        }
    };
    ;
    TranslateLocalService.prototype.manageError = function (callbackFailure, error) {
        console.log(error);
        if (callbackFailure) {
            callbackFailure(error);
        }
    };
    ;
    TranslateLocalService = __decorate([
        Injectable(),
        __metadata("design:paramtypes", [Http])
    ], TranslateLocalService);
    return TranslateLocalService;
}());
export { TranslateLocalService };
//# sourceMappingURL=translateLocal.service.js.map