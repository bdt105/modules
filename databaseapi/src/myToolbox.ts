import { Toolbox } from "bdt105toolbox/dist";

export class MyToolbox extends Toolbox{
    private configuration: any;

    constructor(){
        super();
        this.configuration = {};
        this.configuration = this.loadFromJsonFile("configuration.json");
    }

    logg(text: string){
        if (this.configuration){
            this.log(text, this.configuration.common.logFile, this.configuration.common.logToConsole);
        }
    }

}
