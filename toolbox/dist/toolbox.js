"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var index_1 = require("./index");
var Toolbox = (function () {
    function Toolbox() {
        this.formatDate = function (date) {
            var year = date.getFullYear(), month = date.getMonth() + 1, // months are zero indexed
            day = date.getDate(), hour = date.getHours(), minute = date.getMinutes(), second = date.getSeconds(), hourFormatted = hour % 12 || 12, // hour returned in 24 hour format
            minuteFormatted = minute < 10 ? "0" + minute : minute, morning = hour < 12 ? "am" : "pm";
            return month + "/" + day + "/" + year + " " + hourFormatted + ":" + minute + ":" + second;
        };
    }
    Toolbox.prototype.dateToDbString = function (date) {
        return date.getFullYear() + "-" +
            (date.getMonth().toString().length < 2 ? "0" : "") + date.getMonth() + "-" +
            (date.getDay().toString().length < 2 ? "0" : "") + date.getDay() + " " +
            (date.getHours().toString().length < 2 ? "0" : "") + date.getHours() + ":" +
            (date.getMinutes().toString().length < 2 ? "0" : "") + date.getMinutes() + ":" +
            (date.getSeconds().toString().length < 2 ? "0" : "") + date.getSeconds();
    };
    Toolbox.prototype.isoDateToDbString = function (date) {
        return date.substring(0, 19).replace("T", " ");
    };
    Toolbox.prototype.CSVtoArray = function (text) {
        var re_valid = /^\s*(?:'[^'\\]*(?:\\[\S\s][^'\\]*)*'|"[^"\\]*(?:\\[\S\s][^"\\]*)*"|[^;'"\s\\]*(?:\s+[^;'"\s\\]+)*)\s*(?:;\s*(?:'[^'\\]*(?:\\[\S\s][^'\\]*)*'|"[^"\\]*(?:\\[\S\s][^"\\]*)*"|[^;'"\s\\]*(?:\s+[^;'"\s\\]+)*)\s*)*$/;
        var re_value = /(?!\s*$)\s*(?:'([^'\\]*(?:\\[\S\s][^'\\]*)*)'|"([^"\\]*(?:\\[\S\s][^"\\]*)*)"|([^;'"\s\\]*(?:\s+[^;'"\s\\]+)*))\s*(?:;|$)/g;
        // Return NULL if input string is not well formed CSV string.
        if (!re_valid.test(text))
            return null;
        var a = []; // Initialize array to receive values.
        if (text) {
        }
        return a;
    };
    ;
    Toolbox.prototype.arrayToCSV = function (array) {
        var ret = "";
        for (var i = 0; i < array.length; i++) {
            ret += (ret == "" ? "" : ";") + array[i];
        }
        return ret;
    };
    Toolbox.prototype.Levenshtein = function (a, b) {
        var an = a ? a.length : 0;
        var bn = b ? b.length : 0;
        if (an === 0) {
            return bn;
        }
        if (bn === 0) {
            return an;
        }
        var matrix = new Array(bn + 1);
        for (var i = 0; i <= bn; ++i) {
            var row = matrix[i] = new Array(an + 1);
            row[0] = i;
        }
        var firstRow = matrix[0];
        for (var j = 1; j <= an; ++j) {
            firstRow[j] = j;
        }
        for (var i = 1; i <= bn; ++i) {
            for (var j = 1; j <= an; ++j) {
                if (b.charAt(i - 1) === a.charAt(j - 1)) {
                    matrix[i][j] = matrix[i - 1][j - 1];
                }
                else {
                    matrix[i][j] = Math.min(matrix[i - 1][j - 1], // substitution
                    matrix[i][j - 1], // insertion
                    matrix[i - 1][j] // deletion
                    ) + 1;
                }
            }
        }
        return matrix[bn][an];
    };
    ;
    Toolbox.prototype.arrayOfObjectsToString = function (array, fieldName, search, separator, prefix, suffix) {
        var ret = "";
        if (array) {
            for (var i = 0; i < array.length; i++) {
                ret += (ret === "" ? "" : separator) + array[i][fieldName] + prefix + search + suffix;
            }
        }
        return ret;
    };
    ;
    Toolbox.prototype.urlParamsToObject = function (url) {
        var params = {};
        var arr1 = url.split("?");
        if (arr1.length > 1) {
            var arr2 = arr1[1].split("&");
            for (var i = 0; i < arr2.length; i++) {
                var arr3 = arr2[i].split("=");
                params[arr3[0]] = arr3[1];
            }
        }
        return params;
    };
    Toolbox.prototype.urlBase = function (url) {
        var arr1 = url.split("?");
        return arr1[0];
    };
    Toolbox.prototype.filterArrayOfObjects = function (array, keySearch, keyValue) {
        return array.filter(function (row) { return row[keySearch] == keySearch; });
    };
    Toolbox.prototype.findIndexArrayOfObjects = function (array, keySearch, keyValue) {
        for (var i = 0; i < array.length; i++) {
            if (array[i][keySearch] == keyValue) {
                return i;
            }
        }
        return -1;
    };
    Toolbox.prototype.factorizeMasterSlave = function (data, masterIdFieldName, slaveIdFieldName, slaveName) {
        var rows = [];
        for (var i = 0; i < data.length; i++) {
            var row = data[i];
            var cut = "idprescriptionline";
            var header = {};
            var line = {};
            var masterId = row[masterIdFieldName];
            var newMasterRow = {};
            var newSlaveRow = {};
            var slave = false;
            for (var prop in row) {
                if (prop == slaveIdFieldName) {
                    slave = true;
                }
                if (slave) {
                    newSlaveRow[prop] = row[prop];
                }
                else {
                    newMasterRow[prop] = row[prop];
                }
            }
            var index = this.findIndexArrayOfObjects(rows, masterIdFieldName, row[masterIdFieldName]);
            if (index >= 0) {
                if (!rows[index][slaveName]) {
                    rows[index][slaveName] = [];
                }
                rows[index][slaveName].push(newSlaveRow);
            }
            else {
                newMasterRow[slaveName] = [];
                newMasterRow[slaveName].push(newSlaveRow);
                rows.push(newMasterRow);
            }
        }
        return rows;
    };
    Toolbox.prototype.updateUrlParameter = function (url, param, paramVal) {
        if (url && url.length > 0 && param && param.length > 0) {
            var newAdditionalURL = "";
            var tempArray = url.split("?");
            var baseURL = tempArray[0];
            var additionalURL = tempArray[1];
            var temp = "";
            if (additionalURL) {
                tempArray = additionalURL.split("&");
                for (var i = 0; i < tempArray.length; i++) {
                    if (tempArray[i].split('=')[0] != param) {
                        newAdditionalURL += temp + tempArray[i];
                        temp = "&";
                    }
                }
            }
            var rows_txt = temp + "" + param + "=" + paramVal;
            return baseURL + "?" + newAdditionalURL + rows_txt;
        }
        else {
            return url;
        }
    };
    ;
    Toolbox.prototype.updateUrlParameters = function (url, params) {
        if (url && url.length > 0 && params && params.length > 0) {
            var tempArray = url.split("?");
            var tempUrl = tempArray[0];
            for (var i = 0; i < params.length; i++) {
                var param = params[i];
                tempUrl = this.updateUrlParameter(tempUrl, param.key, param.value);
            }
            return tempUrl;
        }
        else {
            return url;
        }
    };
    ;
    Toolbox.prototype.getUrlParams = function (url) {
        if (url && url.length > 0) {
            var tempArray = url.split("?");
            var additionalURL = tempArray[1];
            var ret = [];
            if (additionalURL) {
                var tempArray = additionalURL.split("&");
                for (var i = 0; i < tempArray.length; i++) {
                    var temp = tempArray[i].split("=");
                    var key = temp[0];
                    var value = temp[1];
                    ret.push({ "key": key, "value": value });
                }
            }
            return ret;
        }
        else {
            return undefined;
        }
    };
    ;
    Toolbox.prototype.deleteEmptyParams = function (url) {
        var rawUrl = this.getUrlWithoutParameters(url);
        var params = this.getUrlParams(url);
        var paramUrl = "";
        if (params && params.length > 0) {
            for (var i = 0; i < params.length; i++) {
                paramUrl += (paramUrl != "" ? "&" : "") + (params[i].value && params[i].value != "" ? params[i].key + "=" + params[i].value : "");
            }
        }
        return rawUrl + "?" + paramUrl;
    };
    Toolbox.prototype.getUrlWithoutParameters = function (url) {
        var tempArray = url.split("?");
        return tempArray[0];
    };
    ;
    Toolbox.prototype.getKeyValue = function (obj) {
        var temp = [];
        if (typeof obj == "object") {
            for (var _i = 0, _a = Object.keys(obj); _i < _a.length; _i++) {
                var key = _a[_i];
                temp.push({ key: key, value: obj[key] });
            }
        }
        return temp;
    };
    Toolbox.prototype.deleteStringList = function (text, separator, textToDelete) {
        var ret = "";
        if (textToDelete && textToDelete.length > 0) {
            var arr = text.split(separator);
            for (var i = 0; i < arr.length; i++) {
                if (arr[i] != textToDelete) {
                    ret += (ret == "" ? "" : separator) + arr[i];
                }
            }
        }
        return ret;
    };
    ;
    Toolbox.prototype.pushArray = function (source, destination) {
        if (source && destination) {
            for (var i = 0; i < source.length; i++) {
                destination.push(source[i]);
            }
        }
    };
    Toolbox.prototype.removeKeyFromArray = function (array, key) {
        for (var i = 0; i < array.length; i++) {
            if (array[i].key == key) {
                array.splice(i, 1);
                return true;
            }
        }
        return false;
    };
    ;
    Toolbox.prototype.isValidDate = function (date) {
        if (date) {
            var timestamp = Date.parse(date);
            return isNaN(timestamp) == false;
        }
        return false;
    };
    Toolbox.prototype.dateDbToStringFr = function (date, separator) {
        if (separator === void 0) { separator = "-"; }
        if (date) {
            return date.substr(8, 2) + separator + date.substr(5, 2) + separator + date.substr(0, 4);
        }
        else {
            return null;
        }
    };
    Toolbox.prototype.dateWithoutTime = function (date) {
        return date.substr(0, 10);
    };
    Toolbox.prototype.diffDateInDays = function (date1, date2) {
        var diffMilliSeconds = date2.getTime() - date1.getTime();
        return diffMilliSeconds / 1000 / 60 / 60 / 24;
    };
    Toolbox.prototype.log = function (text, fileName, logToConsole) {
        if (fileName === void 0) { fileName = null; }
        if (logToConsole === void 0) { logToConsole = true; }
        var dateTime = this.dateToDbString(new Date());
        var txt = dateTime + " " + text + "\r\n";
        if (fileName) {
            var fs = require('fs');
            fs.appendFile(fileName, txt, function (err) {
                if (err) {
                    // Do nothing if can't log
                    // throw err;
                }
            });
        }
        if (logToConsole) {
            console.log(txt);
        }
    };
    Toolbox.prototype.postElastic = function (elasticUrl, index, type, data, id, extra) {
        if (id === void 0) { id = null; }
        if (extra === void 0) { extra = null; }
        if (elasticUrl && index && type && data) {
            var rest = new index_1.Rest();
            var callback_1 = function (data, err) {
                if (err) {
                    throw new Error("No way to get to Elasticsearch! url: " + elasticUrl + ", index: " + index + ", type: " + type + ", id: " + id + ", data: " + JSON.stringify(data) + ". Err: " + JSON.stringify(err));
                }
            };
            rest.call(function (data, err) { return callback_1(data, err); }, (id ? "PUT" : "POST"), elasticUrl + "/" + index + "/" + type + "/" + (id ? id : "") + (extra ? extra : ""), data);
        }
    };
    Toolbox.prototype.loadFromJsonFile = function (fileName, encoding) {
        if (encoding === void 0) { encoding = null; }
        var fs = require('fs');
        var conf = fs.readFileSync(fileName, encoding);
        return JSON.parse(conf);
    };
    Toolbox.prototype.uniqueId = function () {
        var crypto = require("crypto");
        return crypto.randomBytes(16).toString("hex");
    };
    Toolbox.prototype.beautifyXml = function (text) {
        if (text && text != null) {
            var pd = require('pretty-data').pd;
            return pd.xml(text);
        }
        else {
            return "";
        }
    };
    ;
    Toolbox.prototype.beautifyJson = function (text) {
        if (text && text != null) {
            var pd = require('pretty-data').pd;
            return pd.json(text);
        }
        else {
            return "";
        }
    };
    ;
    Toolbox.prototype.writeToStorage = function (key, object, forever) {
        var str;
        if (typeof object != "string") {
            str = JSON.stringify(object);
        }
        else {
            str = object;
        }
        if (forever) {
            localStorage.setItem(key, str);
        }
        else {
            sessionStorage.setItem(key, str);
        }
    };
    ;
    Toolbox.prototype.parseJson = function (str) {
        var json;
        try {
            json = JSON.parse(str);
        }
        catch (e) {
            json = str;
        }
        return json;
    };
    Toolbox.prototype.readFromStorage = function (key) {
        var res = sessionStorage.getItem(key);
        if (res == null) {
            res = localStorage.getItem(key);
        }
        return this.parseJson(res);
    };
    ;
    Toolbox.prototype.removeFromStorage = function (key) {
        localStorage.removeItem(key);
        sessionStorage.removeItem(key);
    };
    ;
    // https://www.npmjs.com/package/xml2js
    // https://github.com/Leonidas-from-XIV/node-xml2js
    Toolbox.prototype.xml2json = function (xml, callback) {
        if (callback === void 0) { callback = null; }
        if (xml) {
            var xml2js = require('xml2js');
            var async = callback !== null;
            var parser = new xml2js.Parser({ "mergeAttrs": true, "async": async });
            var ret = xml;
            parser.parseString(xml, function (err, result) {
                ret = result;
                if (callback) {
                    if (err) {
                        callback(xml);
                    }
                    else {
                        callback(result);
                    }
                }
            });
            return ret;
        }
        else {
            if (callback) {
                callback(null);
            }
            else {
                return xml;
            }
        }
    };
    Toolbox.prototype.fillDocWithContent = function (doc, content) {
        if (doc) {
            doc.open();
            doc.write(content);
            doc.close();
        }
    };
    return Toolbox;
}());
exports.Toolbox = Toolbox;
