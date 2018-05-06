import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { Toolbox } from 'bdt105toolbox/dist';
var ConfigurationService = /** @class */ (function () {
    function ConfigurationService(http) {
        this.http = http;
        this.toolbox = new Toolbox();
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