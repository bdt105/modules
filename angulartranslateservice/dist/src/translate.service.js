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
import { DatabaseService } from 'bdt105angulardatabaseservice';
import { ConnexionService } from 'bdt105angularconnexionservice';
import { Toolbox } from 'bdt105toolbox/dist';
var TranslateService = /** @class */ (function () {
    function TranslateService(databaseService, connexionService) {
        this.databaseService = databaseService;
        this.connexionService = connexionService;
        this.configuration = { "translateTags": true };
        this.toolbox = new Toolbox();
        this.translation = this.toolbox.readFromStorage("translation");
        if (!this.translation) {
            var callback = function () {
            };
            this.loadFromDatabase(callback, callback);
        }
    }
    TranslateService.prototype.setDatabaseBaseUrl = function (baseUrl) {
        this.databaseService.configuration.baseUrl = baseUrl;
    };
    TranslateService.prototype.translate = function (text) {
        if (this.translation) {
            for (var i = 0; i < this.translation.length; i++) {
                if (this.translation[i].name == text) {
                    return this.translation[i].label;
                }
            }
        }
        return text;
    };
    TranslateService.prototype.t = function (text) {
        return this.translate(text);
    };
    TranslateService.prototype.loadFromDatabase = function (callBackSuccess, callBackFailure) {
        var _this = this;
        var conn = this.connexionService.getConnexion();
        if (conn) {
            this.databaseService.connect(conn.currentUser.login, conn.currentUser.password);
            var sql = "SELECT * FROM label where user = 'everyone' and domain = 'rest' and lang = '" + conn.currentUser.lang + "'";
            this.databaseService.sql(function (data) { return _this.success(callBackSuccess, data); }, function (data) { return _this.failure(callBackFailure, data); }, sql);
        }
    };
    TranslateService.prototype.success = function (callBackSuccess, data) {
        this.translation = data.json.results;
        this.toolbox.writeToStorage("translation", this.translation, false);
        if (callBackSuccess) {
            callBackSuccess(data);
        }
    };
    ;
    TranslateService.prototype.failure = function (callBackFailure, data) {
        if (callBackFailure) {
            callBackFailure(data);
        }
    };
    ;
    TranslateService.prototype.getTranslateTag = function () {
        var setting = this.toolbox.readFromStorage("setting");
        var translateTags = this.configuration.translateTags;
        if (setting && setting.translateTags) {
            translateTags = setting.translateTags;
        }
        return translateTags;
    };
    ;
    TranslateService.prototype.refresh = function (callBackSuccess, callBackFailure) {
        this.loadFromDatabase(callBackSuccess, callBackFailure);
    };
    TranslateService = __decorate([
        Injectable(),
        __metadata("design:paramtypes", [DatabaseService, ConnexionService])
    ], TranslateService);
    return TranslateService;
}());
export { TranslateService };
//# sourceMappingURL=translate.service.js.map