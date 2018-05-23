var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
import { Component, Input, Injectable, Inject } from '@angular/core';
import { TranslateService } from 'bdt105angulartranslateservice';
import { TranslateOptions } from './translateoptions.service';
var TranslateComponent = /** @class */ (function () {
    function TranslateComponent(translateService, options) {
        this.translateService = translateService;
        this.options = options;
        this.text = "";
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
    __decorate([
        Input('text')
    ], TranslateComponent.prototype, "text", void 0);
    __decorate([
        Input('isTag')
    ], TranslateComponent.prototype, "isTag", void 0);
    TranslateComponent = __decorate([
        Component({
            selector: 'translate',
            template: '{{translation}}',
            providers: [TranslateService]
        }),
        Injectable(),
        __param(0, Inject(TranslateService)), __param(1, Inject(TranslateOptions))
    ], TranslateComponent);
    return TranslateComponent;
}());
export { TranslateComponent };
//# sourceMappingURL=translate.component.js.map