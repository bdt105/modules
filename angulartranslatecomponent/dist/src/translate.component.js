import { Component, Input } from '@angular/core';
import { TranslateService } from 'bdt105angulartranslateservice';
import { TranslateOptions } from './translateoptions.service';
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
        { type: Component, args: [{
                    selector: 'translate',
                    template: '{{translation}}',
                    providers: [TranslateService]
                },] },
    ];
    /** @nocollapse */
    TranslateComponent.ctorParameters = function () { return [
        { type: TranslateService, },
        { type: TranslateOptions, },
    ]; };
    TranslateComponent.propDecorators = {
        'text': [{ type: Input },],
        'isTag': [{ type: Input },],
    };
    return TranslateComponent;
}());
export { TranslateComponent };
//# sourceMappingURL=translate.component.js.map