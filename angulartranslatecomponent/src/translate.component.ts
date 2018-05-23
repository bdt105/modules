import { Component, Input, OnInit, Injectable, Inject } from '@angular/core';

import { TranslateService } from 'bdt105angulartranslateservice';
import { Toolbox } from 'bdt105toolbox/dist';
import { TranslateOptions } from './translateoptions.service';

@Component({
    selector: 'translate',
    template: '{{translation}}',
    providers: [TranslateService]
})

@Injectable()
export class TranslateComponent implements OnInit {
    @Input('text') text: string = "";
    @Input('isTag') isTag: boolean = false;

    translation: string;

    constructor(@Inject(TranslateService) private translateService: TranslateService, @Inject(TranslateOptions) public options: TranslateOptions) {

    }

    ngOnInit() {
        if (this.isTag) {
            if (this.translateService.getTranslateTag()) {
                this.translation = this.translateService.translate(this.text);
            } else {
                this.translation = this.text;
            }
        } else {
            this.translation = this.translateService.translate(this.text);
        }
        if (this.options && this.options.baseUrl) {
            this.translateService.setDatabaseBaseUrl(this.options.baseUrl);
        }
    }

    setDatabaseBaseUrl(baseUrl: string) {
        this.translateService.setDatabaseBaseUrl(baseUrl);
    }
}