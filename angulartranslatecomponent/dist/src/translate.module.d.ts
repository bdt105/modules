import { ModuleWithProviders, InjectionToken } from '@angular/core';
import { TranslateOptions } from './translateoptions.service';
export declare const USER_OPTIONS: InjectionToken<string>;
export declare class TranslateModule {
    static forRoot(options: TranslateOptions): ModuleWithProviders;
}
