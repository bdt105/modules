var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { NgModule, InjectionToken } from '@angular/core';
import { TranslateComponent } from './translate.component';
export var USER_OPTIONS = new InjectionToken('Translate component user options');
var TranslateModule = /** @class */ (function () {
    function TranslateModule() {
    }
    TranslateModule_1 = TranslateModule;
    TranslateModule.forRoot = function (options) {
        return {
            ngModule: TranslateModule_1,
            providers: [{
                    provide: USER_OPTIONS,
                    useValue: options
                }]
        };
    };
    TranslateModule = TranslateModule_1 = __decorate([
        NgModule({
            declarations: [
                TranslateComponent
            ],
            exports: [TranslateComponent]
        })
    ], TranslateModule);
    return TranslateModule;
    var TranslateModule_1;
}());
export { TranslateModule };
;
//# sourceMappingURL=translate.module.js.map