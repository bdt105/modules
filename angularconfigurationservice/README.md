# Angular Configuration Service

## Principle
Allows to read a configuration file before the angular app starts

## Dependencies
bdt105toolbox (https://github.com/bdt105/modules/tree/master/toolbox)

## Installation
In your app.module.ts insert


``` 
import { ConfigurationService } from 'bdt105angularconfigurationservice';
import { NgModule, APP_INITIALIZER } from '@angular/core';

...

export function init (config: ConfigurationService) {
    config.load();
    return () => {
        return config.load(); // add return
    };
}

@NgModule({
    declarations: [
        ],
    imports: [
        ],
    providers: [
        {
            'provide': APP_INITIALIZER,
            'useFactory': init,
            'deps': [ ConfigurationService ],
            'multi': true
        },
        ConfigurationService
        ],
    bootstrap: [AppComponent]    
});

...

providers: [ ConfigurationService ];

```

Into your component

``` 
import { ConfigurationService } from 'bdt105angularconfigurationservice';

...

constructor(private configurationService: ConfigurationService) {}

public getConfigurationBackgroungColor(){
    let conf = this.configurationService.get();
    return conf.backgroundColor;
}
```