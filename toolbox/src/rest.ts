import { Toolbox } from './toolbox';

export class Rest {

    public logFileName: string;
    public logToConsole: boolean;

    private toolbox:  Toolbox;
    
    constructor(logFileName: string = null, logToConsole: boolean = false){
        this.logFileName = logFileName;
        this.logToConsole = logToConsole;
        this.toolbox = new Toolbox();
    }

    call (callback: Function, method: string, url: string, body: any = null, contentType = "application/json", getRaw = false){
        var request = require('request')
        
        var options = {
            "method": method, 
            "headers": {
                "content-type": contentType,  
                "Accept": "*/*"
            },
            "uri": url,
            "body": JSON.stringify(body)
        }

        request (options, (error: any, response: any, bbody: any) => {
            var data: any = {};
            if (getRaw){
                data.raw = bbody;
            }

            if (error){
                data.error = error;
            }
            
            if (response){
                data.url = response.request.href;
                data.statusCode = response.statusCode;
            }else{
                data.statusCode = "ERR";                
            }

            if (bbody && typeof bbody === "string"){
                data.json = this.toolbox.xml2json(bbody);
            }

            this.toolbox.log(url + JSON.stringify(data), this.logFileName , this.logToConsole);

            if (callback){
                callback(data, data.error);
            } 
        });
    }

}