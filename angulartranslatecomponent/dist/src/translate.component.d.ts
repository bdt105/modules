import { OnInit } from '@angular/core';
import { TranslateService } from 'bdt105angulartranslateservice';
import { TranslateOptions } from './translateoptions.service';
export declare class TranslateComponent implements OnInit {
    private translateService;
    options: TranslateOptions;
    text: string;
    isTag: boolean;
    translation: string;
    constructor(translateService: TranslateService, options: TranslateOptions);
    ngOnInit(): void;
    setDatabaseBaseUrl(baseUrl: string): void;
}
