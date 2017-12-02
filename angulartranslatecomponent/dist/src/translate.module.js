import { NgModule, InjectionToken } from '@angular/core';
import { TranslateComponent } from './translate.component';
export var USER_OPTIONS = new InjectionToken('Translate component user options');
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
        { type: NgModule, args: [{
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
export { TranslateModule };
;
//# sourceMappingURL=translate.module.js.map