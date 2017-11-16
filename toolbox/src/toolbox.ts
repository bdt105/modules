import { Rest } from './index';
export class Toolbox {

    formatDate(date: Date) {
        var year = date.getFullYear(),
            month = date.getMonth() + 1, // months are zero indexed
            day = date.getDate(),
            hour = date.getHours(),
            minute = date.getMinutes(),
            second = date.getSeconds(),
            hourFormatted = hour % 12 || 12, // hour returned in 24 hour format
            minuteFormatted = minute < 10 ? "0" + minute : minute,
            morning = hour < 12 ? "am" : "pm";
    
        return month + "/" + day + "/" + year + " " + hourFormatted + ":" + minute + ":" + second;
    }   
    
    dateToDbString(date: Date){
        return date.getFullYear() + "-" + 
            (date.getMonth().toString().length < 2 ? "0" : "") + date.getMonth() + "-" + 
            (date.getDay().toString().length < 2 ? "0" : "") + date.getDay() + " " + 
            (date.getHours().toString().length < 2 ? "0" : "") + date.getHours() + ":" + 
            (date.getMinutes().toString().length < 2 ? "0" : "") + date.getMinutes() + ":" + 
            (date.getSeconds().toString().length < 2 ? "0" : "") + date.getSeconds();
    }

    isoDateToDbString(date: string){
        return date.substring(0, 19).replace("T", " ");
    }

    CSVtoArray (text: string) : string[] {
        var re_valid = /^\s*(?:'[^'\\]*(?:\\[\S\s][^'\\]*)*'|"[^"\\]*(?:\\[\S\s][^"\\]*)*"|[^;'"\s\\]*(?:\s+[^;'"\s\\]+)*)\s*(?:;\s*(?:'[^'\\]*(?:\\[\S\s][^'\\]*)*'|"[^"\\]*(?:\\[\S\s][^"\\]*)*"|[^;'"\s\\]*(?:\s+[^;'"\s\\]+)*)\s*)*$/;
        var re_value = /(?!\s*$)\s*(?:'([^'\\]*(?:\\[\S\s][^'\\]*)*)'|"([^"\\]*(?:\\[\S\s][^"\\]*)*)"|([^;'"\s\\]*(?:\s+[^;'"\s\\]+)*))\s*(?:;|$)/g;

        // Return NULL if input string is not well formed CSV string.
        if (!re_valid.test(text)) return null;
        var a: string[] = [];                     // Initialize array to receive values.
        if (text){
        }
        return a;
    };

    arrayToCSV(array: string[], separator = ";"): string{
        var ret = "";
        for (var i = 0; i < array.length; i ++){
            ret += (ret == "" ? "" : separator) + array[i];
        }
        return ret;
    }

    Levenshtein (a: string, b: string): number {
        const an = a ? a.length : 0;
        const bn = b ? b.length : 0;
        if (an === 0) {
            return bn;
        }
        if (bn === 0) {
            return an;
        }
        const matrix = new Array<number[]>(bn + 1);
        for (let i = 0; i <= bn; ++i) {
            let row = matrix[i] = new Array<number>(an + 1);
            row[0] = i;
        }
        const firstRow = matrix[0]; 
        for (let j = 1; j <= an; ++j) {
            firstRow[j] = j;
        }
        for (let i = 1; i <= bn; ++i) {
            for (let j = 1; j <= an; ++j) {
                if (b.charAt(i - 1) === a.charAt(j - 1)) {
                    matrix[i][j] = matrix[i - 1][j - 1];
                } else {
                    matrix[i][j] = Math.min(
                        matrix[i - 1][j - 1], // substitution
                        matrix[i][j - 1], // insertion
                        matrix[i - 1][j] // deletion
                    ) + 1;
                }
            }
        }
        return matrix[bn][an];
    };

    arrayOfObjectsToString (array: any, fieldName: string, value: string, separator: string, prefix: string, suffix: string){
        var ret = "";
        if (array){
            for (var i = 0; i < array.length; i++){
                ret += (ret === "" ? "" : separator) + array[i][fieldName] + prefix + value + suffix;
            }
        }
        return ret;
    }; 

    urlParamsToObject(url: string){
        var params: any = {}
        var arr1 = url.split("?");
        if (arr1.length > 1){
            var arr2 = arr1[1].split("&");
            for (var i=0; i < arr2.length; i++){
                var arr3 = arr2[i].split("=");
                params[arr3[0]] = arr3[1];
            }
        }
        return params;
    } 

    urlBase(url: string){
        var arr1 = url.split("?");
        return arr1[0];
    } 

    filterArrayOfObjects(array: any[], keySearch: string, keyValue: string){
        return array.filter((row) => row[keySearch] == keySearch);
    }

    findIndexArrayOfObjects(array: any[], keySearch: string, keyValue: string){
        for (var i = 0; i < array.length; i++){
            if (array[i][keySearch] == keyValue){
                return i;
            }
        }
        return -1;
    }

    factorizeMasterSlave(data: any, masterIdFieldName: string, slaveIdFieldName: string, slaveName: string){
        let rows = [];
        for (var i = 0; i < data.length; i++){
            let row = data[i];
            let cut = "idprescriptionline";
            let header: any = {};
            let line: any = {};
            let masterId = row[masterIdFieldName];
            let newMasterRow: any = {};
            let newSlaveRow: any = {};
            let slave = false;
            for (var prop in row){
                if (prop == slaveIdFieldName){
                    slave = true;
                }
                if (slave){
                    newSlaveRow[prop] = row[prop];
                }else{
                    newMasterRow[prop] = row[prop];
                }
            }

            let index = this.findIndexArrayOfObjects(rows, masterIdFieldName, row[masterIdFieldName]);
            if (index >= 0){
                if (!rows[index][slaveName]){
                    rows[index][slaveName] = [];
                }
                rows[index][slaveName].push(newSlaveRow);
            }else{
                newMasterRow[slaveName] = [];
                newMasterRow[slaveName].push(newSlaveRow);
                rows.push(newMasterRow);               
            }
        }
        return rows;
    }    

    updateUrlParameter (url: string, parameter: string, value: string){
        if (url && url.length > 0 && parameter && parameter.length > 0){
            var newAdditionalURL = "";
            var tempArray = url.split("?");
            var baseURL = tempArray[0];
            var additionalURL = tempArray[1];
            var temp = "";
            if (additionalURL) {
                tempArray = additionalURL.split("&");
                for (var i=0; i<tempArray.length; i++){
                    if (tempArray[i].split('=')[0] != parameter){
                        newAdditionalURL += temp + tempArray[i];
                        temp = "&";
                    }
                }
            }

            var rows_txt = temp + "" + parameter + "=" + value;
            return baseURL + "?" + newAdditionalURL + rows_txt;
        }else{
            return url;
        }
    };
    
    updateUrlParameters (url: string, parameters: any[]){
        if (url && url.length > 0 && parameters && parameters.length > 0){
            var tempArray = url.split("?");
            var tempUrl = tempArray[0];
            for (var i = 0; i < parameters.length; i++){
                var param = parameters[i];
                tempUrl = this.updateUrlParameter(tempUrl, param.key, param.value);
            }
            return tempUrl;
        }else{
            return url;
        }
    };
        
    getUrlParams (url: string){
        if (url && url.length > 0){
            var tempArray = url.split("?");
            var additionalURL = tempArray[1];
            var ret = [];
            if (additionalURL) {
                var tempArray = additionalURL.split("&");
                for (var i = 0; i < tempArray.length ; i++){
                    var temp = tempArray[i].split("=");
                    var key = temp[0];
                    var value = temp[1];
                    ret.push({"key": key, "value": value});
                }
            }
            return ret;
        }else{
            return undefined;
        }
    };
    
    deleteEmptyParams(url: string){
        var rawUrl = this.urlBase(url);
        var params = this.getUrlParams(url);
        var paramUrl = "";
        if (params && params.length > 0){
            for (var i = 0; i < params.length; i++){
                paramUrl += (paramUrl != "" ? "&" : "") + (params[i].value && params[i].value != "" ? params[i].key + "=" + params[i].value : "");
            }
        }
        return rawUrl + "?" + paramUrl;
    }

    getKeyValue(obj: any){
        var temp: any[] = [];

        if (typeof obj == "object"){
            for (var key of Object.keys(obj)) {
                temp.push({key: key, value: obj[key]});
            }
        }
        return temp;
    }

    deleteStringList (text: string, separator: string, textToDelete: string){
        var ret = "";
        if (textToDelete && textToDelete.length > 0){
            var arr = text.split(separator);
            for (var i = 0; i < arr.length; i++){
                if (arr[i] != textToDelete){
                    ret += (ret == "" ? "" : separator) + arr[i];
                }
            }
        }
        return ret;
    };

    pushArray(source: any[], destination: any[]){
        if (source && destination){
            for(var i=0; i < source.length; i++){
                destination.push(source[i]);
            }
        }
    }

    removeKeyFromArray (array: any[], key: string){
        for (var i = 0; i < array.length; i++) {
            if(array[i].key == key) {
                array.splice(i, 1);
                return true;
            }
        }
        return false;
    };    

    isValidDate(date: string){
        if (date){
            var timestamp = Date.parse(date)
            return isNaN(timestamp) == false;
        }
        return false;
    }

    dateDbToStringFr(date: string, separator = "-"){
        if (date){
            return date.substr(8, 2) + separator + date.substr(5, 2) + separator + date.substr(0, 4);
        }else{
            return null;
        }
    }

    dateWithoutTime(date: string){
        return date.substr(0, 10);
    }

    diffDateInDays(date1: Date, date2: Date){
        let diffMilliSeconds = date2.getTime() - date1.getTime();
        return diffMilliSeconds / 1000 / 60 / 60 / 24;
    }

    log (text: string, fileName: string = null, logToConsole: boolean = true){
        var dateTime = this.dateToDbString(new Date());
        let txt = dateTime + " " + text + "\r\n";
        if (fileName){
            var fs = require('fs');
            fs.appendFile(fileName, txt, (err: any) => {
                if (err) {
                    // Do nothing if can't log
                    // throw err;
                }
            });
        }
        if (logToConsole){
            console.log(txt);
        }
    }    

    postElastic (elasticUrl: string, index: string, type: string, data: any, id: string = null, extra: string = null){
        if (elasticUrl && index && type && data){
            let rest = new Rest();
            let callback = function(data: any, err: any){
                if (err){
                    throw new Error("No way to get to Elasticsearch! url: " + elasticUrl + ", index: " + index + ", type: " + type + ", id: " + id + ", data: " + JSON.stringify(data) + ". Err: " + JSON.stringify(err));
                }
            }
            
            rest.call((data: any, err: any) => callback(data, err), (id ? "PUT": "POST"), elasticUrl + "/" + index + "/" + type + "/" + (id ? id : "") + (extra ? extra : ""), data);
        }
    }

    loadFromJsonFile(fileName: string, encoding: string = null){
        var fs = require('fs');
        
        var conf = fs.readFileSync(fileName, encoding);
        return JSON.parse(conf);        
    }

    uniqueId(){
        var crypto = require("crypto");
        return crypto.randomBytes(16).toString("hex");
    }

    beautifyXml (text: string){
        if (text && text != null){
            var pd = require('pretty-data').pd;
            return pd.xml(text);
        }else{
            return "";
        }          
    };    

    beautifyJson (text: string){
        if (text && text != null){
            var pd = require('pretty-data').pd;
            return pd.json(text);
        }else{
            return "";
        }                  
    };

    writeToStorage (key: string, object: any, forever: boolean){
        var str: string;
        if (typeof object != "string"){
            str = JSON.stringify(object);
        }else{
            str = object;
        }
        if (forever){
            localStorage.setItem(key, str);
        }else{
            sessionStorage.setItem(key, str);
        }
    };

    parseJson(str: string) {
        var json: any;
        try {
            json = JSON.parse(str);
        } catch (e) {
            json = str;
        }
        return json;
    }

    readFromStorage (key: string){
        var res = sessionStorage.getItem(key);
        if (res == null){
            res = localStorage.getItem(key);
        }
        return this.parseJson(res);
    };

    removeFromStorage (key: string){
        localStorage.removeItem(key);
        sessionStorage.removeItem(key);
    };    

    // https://www.npmjs.com/package/xml2js
    // https://github.com/Leonidas-from-XIV/node-xml2js
    xml2json(xml: string, callback: Function = null){
        if (xml){
            var xml2js = require('xml2js'); 
            var async = callback !== null;
            var parser = new xml2js.Parser({"mergeAttrs": true, "async": async});
            var ret: any = xml;
            parser.parseString(xml, (err: any, result: any) => {
                ret = result;
                if (callback){
                    if (err){
                        callback(xml);                        
                    }else{
                        callback(result);
                    }
                }
            });
            return ret;
        }else{
            if (callback){
                callback(null);
            }else{
                return xml;
            }
        }
    }  

    fillDocWithContent(doc: any, content: string){
        if (doc){
            doc.open();
            doc.write(content);
            doc.close();        
        }
    }      

}