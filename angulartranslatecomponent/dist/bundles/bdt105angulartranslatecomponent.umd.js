(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('@angular/core'), require('bdt105angulartranslateservice')) :
	typeof define === 'function' && define.amd ? define(['exports', '@angular/core', 'bdt105angulartranslateservice'], factory) :
	(factory((global.ng = global.ng || {}, global.ng.bdt105angulartranslatecomponent = {}),global.ng.core,global.bdt105angulartranslateservice));
}(this, (function (exports,core,bdt105angulartranslateservice) { 'use strict';

var TranslateOptions = /** @class */ (function () {
    function TranslateOptions() {
    }
    TranslateOptions.decorators = [
        { type: core.Injectable },
    ];
    /** @nocollapse */
    TranslateOptions.ctorParameters = function () { return []; };
    return TranslateOptions;
}());

var TranslateComponent = /** @class */ (function () {
    function TranslateComponent(translateService, options) {
        this.translateService = translateService;
        this.options = options;
        this.isTag = false;
    }
    TranslateComponent.prototype.ngOnInit = function () {
        if (this.isTag) {
            if (this.translateService.getTranslateTag()) {
                this.translation = this.translateService.translate(this.text);
            }
            else {
                this.translation = this.text;
            }
        }
        else {
            this.translation = this.translateService.translate(this.text);
        }
        if (this.options && this.options.baseUrl) {
            this.translateService.setDatabaseBaseUrl(this.options.baseUrl);
        }
    };
    TranslateComponent.prototype.setDatabaseBaseUrl = function (baseUrl) {
        this.translateService.setDatabaseBaseUrl(baseUrl);
    };
    TranslateComponent.decorators = [
        { type: core.Component, args: [{
                    selector: 'translate',
                    template: '{{translation}}',
                    providers: [bdt105angulartranslateservice.TranslateService]
                },] },
        { type: core.Injectable },
    ];
    /** @nocollapse */
    TranslateComponent.ctorParameters = function () { return [
        { type: bdt105angulartranslateservice.TranslateService, },
        { type: TranslateOptions, },
    ]; };
    TranslateComponent.propDecorators = {
        'text': [{ type: core.Input },],
        'isTag': [{ type: core.Input },],
    };
    return TranslateComponent;
}());

var USER_OPTIONS = new core.InjectionToken('Translate component user options');
var TranslateModule = /** @class */ (function () {
    function TranslateModule() {
    }
    TranslateModule.forRoot = function (options) {
        return {
            ngModule: TranslateModule,
            providers: [{
                    provide: USER_OPTIONS,
                    useValue: options
                }]
        };
    };
    TranslateModule.decorators = [
        { type: core.NgModule, args: [{
                    declarations: [
                        TranslateComponent
                    ],
                    exports: [TranslateComponent]
                },] },
    ];
    /** @nocollapse */
    TranslateModule.ctorParameters = function () { return []; };
    return TranslateModule;
}());

exports.TranslateModule = TranslateModule;
exports.TranslateComponent = TranslateComponent;
exports.TranslateOptions = TranslateOptions;

Object.defineProperty(exports, '__esModule', { value: true });

})));
