import { Toolbox } from "bdt105toolbox/dist";

export class MyToolbox extends Toolbox{
    private configuration: any;
    private toolbox: Toolbox;

    constructor(){
        super();
        this.configuration = {};
        this.configuration = this.loadFromJsonFile("./conf/configuration.json");
    }

    logg(text: string){
        if (this.configuration){
            this.log(this.configuration.common.logFile, text, this.configuration.common.logToConsole);
        }
    }

}
