import { NgModule, ModuleWithProviders, InjectionToken } from '@angular/core';
import { TranslateComponent } from './translate.component';
import { TranslateOptions } from './translateoptions.service';

export const USER_OPTIONS: InjectionToken<string> = new InjectionToken('Translate component user options');


@NgModule({
  declarations: [
    TranslateComponent
  ],
  exports: [TranslateComponent]
})

export class TranslateModule {
  static forRoot(options: TranslateOptions): ModuleWithProviders {
    return {
      ngModule: TranslateModule,
      providers: [{
        provide: USER_OPTIONS,
        useValue: options
      }]
    };
  }

};