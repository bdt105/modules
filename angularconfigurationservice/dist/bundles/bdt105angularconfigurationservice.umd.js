(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('@angular/core'), require('@angular/http'), require('rxjs/add/operator/map'), require('bdt105toolbox/dist')) :
	typeof define === 'function' && define.amd ? define(['exports', '@angular/core', '@angular/http', 'rxjs/add/operator/map', 'bdt105toolbox/dist'], factory) :
	(factory((global.ng = global.ng || {}, global.ng.bdt105angularconfigurationservice = {}),global.ng.core,global.http,global.Rx.Observable.prototype,global.dist));
}(this, (function (exports,core,http,map,dist) { 'use strict';

var ConfigurationService = /** @class */ (function () {
    function ConfigurationService(http$$1) {
        this.http = http$$1;
        this.toolbox = new dist.Toolbox();
    }
    ConfigurationService.prototype.get = function (name) {
        return this.toolbox.readFromStorage(name);
    };
    ConfigurationService.prototype.load = function (name, fileUrl, forever) {
        var _this = this;
        console.log("loading ..." + name);
        if (!this.data) {
            this.data = [];
        }
        return new Promise(function (resolve, reject) {
            _this.http
                .get(fileUrl)
                .map(function (res) { return res.json(); })
                .subscribe(function (response) {
                _this.data[name] = response;
                _this.toolbox.writeToStorage(name, response, forever);
                console.log(name + " loading complete", _this.data);
                resolve(true);
            });
        });
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
