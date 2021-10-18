"use strict";
exports.__esModule = true;
exports.Toolbox = void 0;
var index_1 = require("./index");
var Toolbox = /** @class */ (function () {
    function Toolbox() {
    }
    Toolbox.prototype.formatDate = function (date, format, lang) {
        if (format === void 0) { format = "DD/MM/YYYY HH:mm:ss"; }
        if (lang === void 0) { lang = ""; }
        if (date) {
            var moment = require('moment');
            if (lang) {
                moment.locale(lang.toLowerCase());
            }
            if (this.isValidDate(date)) {
                var d = moment(date);
                return d.format(format);
            }
        }
        return null;
    };
    Toolbox.prototype.stringToDate = function (date, format) {
        var ret = null;
        var moment = require('moment');
        if (date && format) {
            ret = moment(date, format).toDate();
        }
        return ret;
    };
    Toolbox.prototype.smartDate = function (date) {
        if (date) {
            var now = new Date();
            var newFormat = "DD/MM/YYYY HH:mm";
            var y1 = now.getFullYear();
            var y2 = date.getFullYear();
            if (y1 == y2) {
                newFormat = newFormat.replace("/YYYY", "");
                var d1 = now.getDate();
                var d2 = date.getDate();
                var m1 = now.getMonth();
                var m2 = now.getMonth();
                if (d1 == d2 && m1 == m2) {
                    newFormat = newFormat.replace("DD/MM ", "");
                }
                else {
                    newFormat = newFormat.replace(" HH:mm", "");
                }
            }
            return this.formatDate(date, newFormat);
        }
        return null;
    };
    Toolbox.prototype.dateToDbString = function (date) {
        return date.toISOString().substr(0, 19).replace('T', ' ');
        // return date.getFullYear() + "-" + 
        //     (date.getMonth().toString().length < 2 ? "0" : "") + date.getMonth() + "-" + 
        //     (date.getDay().toString().length < 2 ? "0" : "") + date.getDay() + " " + 
        //     (date.getHours().toString().length < 2 ? "0" : "") + date.getHours() + ":" + 
        //     (date.getMinutes().toString().length < 2 ? "0" : "") + date.getMinutes() + ":" + 
        //     (date.getSeconds().toString().length < 2 ? "0" : "") + date.getSeconds();
    };
    Toolbox.prototype.isoDateToDbString = function (date) {
        return date.substring(0, 19).replace("T", " ");
    };
    Toolbox.prototype.formatDateToLocal = function (date, showTime) {
        if (showTime === void 0) { showTime = false; }
        var moment = require('moment');
        if (this.isValidDate(date)) {
            var d = moment(date);
            return d.format('L') + (showTime ? " " + d.format('LTS') : "");
        }
        else {
            return "";
        }
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
    Toolbox.prototype.arrayToCSV = function (array, separator) {
        if (separator === void 0) { separator = ";"; }
        var ret = "";
        for (var i = 0; i < array.length; i++) {
            ret += (ret == "" ? "" : separator) + array[i];
        }
        return ret;
    };
    Toolbox.prototype.shuffleArray = function (array) {
        var counter = array.length;
        var arr = this.cloneObject(array);
        // While there are elements in the array
        while (counter > 0) {
            // Pick a random index
            var index = Math.floor(Math.random() * counter);
            // Decrease counter by 1
            counter--;
            // And swap the last element with it
            var temp = arr[counter];
            arr[counter] = arr[index];
            arr[index] = temp;
        }
        return arr;
    };
    Toolbox.prototype.levenshtein = function (a, b) {
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
    Toolbox.prototype.arrayOfObjectsToString = function (array, fieldName, value, separator, prefix, suffix) {
        var ret = "";
        if (array) {
            for (var i = 0; i < array.length; i++) {
                ret += (ret === "" ? "" : separator) + array[i][fieldName] + prefix + value + suffix;
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
    Toolbox.prototype.filterArrayOfObjects = function (array, keySearch, keyValue, caseSensitive, accentSensitive, exactMatching, include) {
        var _this = this;
        if (caseSensitive === void 0) { caseSensitive = false; }
        if (accentSensitive === void 0) { accentSensitive = false; }
        if (exactMatching === void 0) { exactMatching = true; }
        if (include === void 0) { include = false; }
        if (array && Array.isArray(array)) {
            return array.filter(function (row) {
                if (typeof keyValue === 'string') {
                    return _this.compareString(row[keySearch], keyValue, caseSensitive, accentSensitive, exactMatching, include);
                }
                else {
                    return row[keySearch] == keyValue;
                }
            });
        }
        else {
            return array;
        }
    };
    Toolbox.prototype.filterArrayOfObjectsAllFields = function (array, searchTerm, caseSensitive, accentSensitive, exactMatching, include) {
        var _this = this;
        if (caseSensitive === void 0) { caseSensitive = false; }
        if (accentSensitive === void 0) { accentSensitive = false; }
        if (exactMatching === void 0) { exactMatching = true; }
        if (include === void 0) { include = true; }
        if (array && Array.isArray(array)) {
            return array.filter(function (row) {
                searchTerm = searchTerm + "";
                var temp = JSON.stringify(row);
                if (exactMatching) {
                    return temp.indexOf(':"' + searchTerm + '"') >= 0;
                }
                else {
                    temp = _this.prepareStrinForSearch(temp, caseSensitive, accentSensitive);
                    searchTerm = _this.prepareStrinForSearch(searchTerm, caseSensitive, accentSensitive);
                    if (include) {
                        return temp.indexOf(searchTerm) >= 0;
                    }
                    else {
                        return temp.indexOf(':"' + searchTerm + '"') >= 0;
                    }
                }
            });
        }
        else {
            return array;
        }
    };
    Toolbox.prototype.findIndexArrayOfObjects = function (array, keySearch, keyValue, equal) {
        if (equal === void 0) { equal = true; }
        for (var i = 0; i < array.length; i++) {
            if (equal) {
                if (array[i][keySearch] == keyValue) {
                    return i;
                }
            }
            else {
                if (array[i][keySearch] != keyValue) {
                    return i;
                }
            }
        }
        return -1;
    };
    Toolbox.prototype.deleteObjectInList = function (array, keySearch, keyValue, equal) {
        if (equal === void 0) { equal = true; }
        var index = this.findIndexArrayOfObjects(array, keySearch, keyValue, equal);
        if (index >= 0) {
            array.splice(index, 1);
        }
        return index;
    };
    Toolbox.prototype.deleteObjectsInList = function (array, keySearch, keyValue, equal) {
        if (equal === void 0) { equal = true; }
        var deleted = 0;
        var index = this.findIndexArrayOfObjects(array, keySearch, keyValue, equal);
        while (index >= 0) {
            array.splice(index, 1);
            index = this.findIndexArrayOfObjects(array, keySearch, keyValue, equal);
            deleted++;
        }
        return deleted;
    };
    Toolbox.prototype.replaceObjectInList = function (array, keySearch, keyValue, object) {
        var index = this.findIndexArrayOfObjects(array, keySearch, keyValue);
        if (index >= 0) {
            array.splice(index, 1, object);
        }
        return index;
    };
    Toolbox.prototype.insertObjectInList = function (array, keySearch, keyValue, object) {
        var index = this.findIndexArrayOfObjects(array, keySearch, keyValue);
        if (index >= 0) {
            array.splice(index, 0, object);
        }
        return index;
    };
    Toolbox.prototype.pushObjectInList = function (array, keySearch, keyValue, object, allowDuplicates) {
        var index = this.findIndexArrayOfObjects(array, keySearch, keyValue);
        if (index >= 0) {
            if (allowDuplicates) {
                array.push(object);
            }
            else {
                array[index] = object;
            }
        }
        else {
            array.push(object);
        }
        return index;
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
    Toolbox.prototype.updateUrlParameter = function (url, parameter, value) {
        if (url && url.length > 0 && parameter && parameter.length > 0) {
            var newAdditionalURL = "";
            var tempArray = url.split("?");
            var baseURL = tempArray[0];
            var additionalURL = tempArray[1];
            var temp = "";
            if (additionalURL) {
                tempArray = additionalURL.split("&");
                for (var i = 0; i < tempArray.length; i++) {
                    if (tempArray[i].split('=')[0] != parameter) {
                        newAdditionalURL += temp + tempArray[i];
                        temp = "&";
                    }
                }
            }
            var rows_txt = temp + "" + parameter + "=" + value;
            return baseURL + "?" + newAdditionalURL + rows_txt;
        }
        else {
            return url;
        }
    };
    ;
    Toolbox.prototype.updateUrlParameters = function (url, parameters) {
        if (url && url.length > 0 && parameters && parameters.length > 0) {
            var tempArray = url.split("?");
            var tempUrl = tempArray[0];
            for (var i = 0; i < parameters.length; i++) {
                var param = parameters[i];
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
        var rawUrl = this.urlBase(url);
        var params = this.getUrlParams(url);
        var paramUrl = "";
        if (params && params.length > 0) {
            for (var i = 0; i < params.length; i++) {
                paramUrl += (paramUrl != "" ? "&" : "") + (params[i].value && params[i].value != "" ? params[i].key + "=" + params[i].value : "");
            }
        }
        return rawUrl + "?" + paramUrl;
    };
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
        if (Object.prototype.toString.call(date) === "[object Date]") {
            // it is a date
            if (isNaN(date.getTime())) {
                return false;
            }
            else {
                return true;
            }
        }
        else {
            if (typeof date == "string") {
                var timestamp = Date.parse(date);
                return isNaN(timestamp) == false;
            }
            else {
                return false;
            }
        }
    };
    Toolbox.prototype.isDateHigherThanNow = function (date) {
        var ret = true;
        try {
            var now = new Date();
            if (typeof date == "string") {
                var d = new Date(date);
                ret = isNaN(d.getTime()) ? true : d.getTime() >= now.getTime();
            }
            else {
                ret = isNaN(date.getTime()) ? true : date.getTime() >= now.getTime();
            }
        }
        catch (error) {
        }
        return ret;
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
    // 2018-02-02 14:50:35
    Toolbox.prototype.dateStringDbToDate = function (date) {
        if (date) {
            return new Date(parseInt(date.substr(0, 4)), parseInt(date.substr(5, 2)), parseInt(date.substr(8, 2)), parseInt(date.substr(11, 2)), parseInt(date.substr(14, 2)), parseInt(date.substr(17, 2)));
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
    Toolbox.prototype.log = function (text, fileName, logToConsole, isError, maxLength) {
        if (fileName === void 0) { fileName = null; }
        if (logToConsole === void 0) { logToConsole = true; }
        if (isError === void 0) { isError = false; }
        if (maxLength === void 0) { maxLength = null; }
        var dateTime = this.dateToDbString(new Date());
        var txtt = dateTime + " " + JSON.stringify(text);
        if (maxLength) {
            txtt = txtt.substr(0, maxLength);
        }
        var txt = txtt + "\r\n";
        if (fileName) {
            var fs = require('fs');
            fs.appendFile(fileName, txt, function (err) {
                if (err) {
                    console.error(err);
                }
            });
        }
        if (logToConsole) {
            if (!isError) {
                console.log(txt);
            }
            else {
                console.error(txt);
            }
        }
    };
    Toolbox.prototype.logError = function (text, fileName, logToConsole, maxLength) {
        if (fileName === void 0) { fileName = null; }
        if (logToConsole === void 0) { logToConsole = true; }
        if (maxLength === void 0) { maxLength = null; }
        this.log(text, fileName, logToConsole, true, maxLength);
    };
    Toolbox.prototype.postElastic = function (elasticUrl, index, type, data, id, extra, headers) {
        if (id === void 0) { id = null; }
        if (extra === void 0) { extra = null; }
        if (headers === void 0) { headers = null; }
        if (elasticUrl && index && type && data) {
            var rest = new index_1.Rest();
            var callback_1 = function (data, err) {
                if (err) {
                    throw new Error("No way to get to Elasticsearch! url: " + elasticUrl + ", index: " + index + ", type: " + type + ", id: " + id + ", data: " + JSON.stringify(data) + ". Err: " + JSON.stringify(err));
                }
            };
            rest.call(function (data, err) { return callback_1(data, err); }, (id ? "PUT" : "POST"), elasticUrl + "/" + index + "/" + type + "/" + (id ? id : "") + (extra ? extra : ""), data, "application/json", true, headers);
        }
    };
    Toolbox.prototype.loadFromJsonFile = function (fileName, encoding) {
        if (encoding === void 0) { encoding = null; }
        var fs = require('fs');
        if (fs.existsSync(fileName)) {
            var conf = fs.readFileSync(fileName, encoding);
            return JSON.parse(conf);
        }
        else {
            return null;
        }
    };
    Toolbox.prototype.uniqueId = function () {
        var crypto = require("crypto");
        return crypto.randomBytes(16).toString("hex");
    };
    Toolbox.prototype.getUniqueId = function () {
        return Math.random().toString(36).substring(2) + (new Date()).getTime().toString(36);
    };
    Toolbox.prototype.getUniqueShortId = function () {
        var shortid = require('shortid');
        return shortid.generate();
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
            if (localStorage) {
                localStorage.setItem(key, str);
            }
        }
        else {
            if (sessionStorage) {
                sessionStorage.setItem(key, str);
            }
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
    Toolbox.prototype.isJson = function (str) {
        try {
            var json = JSON.parse(str);
            return true;
        }
        catch (e) {
            return false;
        }
    };
    Toolbox.prototype.readFromStorage = function (key, parseJson) {
        if (parseJson === void 0) { parseJson = true; }
        if (sessionStorage) {
            var res = sessionStorage.getItem(key);
            if (localStorage && res == null) {
                res = localStorage.getItem(key);
            }
            return (parseJson ? this.parseJson(res) : res);
        }
        else {
            return null;
        }
    };
    ;
    Toolbox.prototype.removeFromStorage = function (key) {
        if (localStorage) {
            localStorage.removeItem(key);
        }
        if (sessionStorage) {
            sessionStorage.removeItem(key);
        }
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
    Toolbox.prototype.sortArrayOfObjects = function (arr, sortProperty, asc) {
        if (asc === void 0) { asc = true; }
        function compare(a, b) {
            if (a[sortProperty] < b[sortProperty])
                return asc ? -1 : 1;
            if (a[sortProperty] > b[sortProperty])
                return asc ? 1 : -1;
            return 0;
        }
        return arr.sort(compare);
    };
    // Retreives a node of an object.
    // If the object is an array with only one element wich is not an array nor an object then it's retreived
    Toolbox.prototype.searchElementSpecial = function (list, key, value) {
        for (var i = 0; i < list.length; i++) {
            if (Array.isArray(list[i][key]) && list[i][key].length == 1) {
                if (list[i][key][0] == value)
                    return list[i];
            }
            else {
                if (list[i][key] == value)
                    return list[i];
            }
        }
    };
    Toolbox.prototype.sES = function (list, key, value) {
        return (this.searchElementSpecial(list, key, value));
    };
    // get value of an object. 
    // If the object is an array with only one element wich is not an array nor an object then it's retreived
    Toolbox.prototype.getValueSpecial = function (object, fieldName, subFieldName) {
        if (subFieldName === void 0) { subFieldName = null; }
        if (object) {
            if (object[fieldName]) {
                if (Array.isArray(object[fieldName])) {
                    if (object[fieldName].length == 1) {
                        if (typeof object[fieldName][0] == "string") {
                            return object[fieldName][0];
                        }
                        else {
                            if (subFieldName) {
                                return this.getValueSpecial(object[fieldName][0], subFieldName);
                            }
                            else {
                                return object[fieldName][0];
                            }
                        }
                    }
                    else {
                        return object[fieldName];
                    }
                }
            }
        }
        return null;
    };
    // idem to getValueSpecial
    Toolbox.prototype.gVS = function (object, fieldName, subFieldName) {
        if (subFieldName === void 0) { subFieldName = null; }
        return this.getValueSpecial(object, fieldName, subFieldName);
    };
    Toolbox.prototype.escapeRegExp = function (str) {
        return str.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1");
    };
    Toolbox.prototype.replaceAll = function (text, search, replacement) {
        return text.replace(new RegExp(this.escapeRegExp(search), 'g'), replacement);
    };
    ;
    Toolbox.prototype.addMomentToDate = function (date, unit, value) {
        var moment = require('moment');
        var dd = moment(date);
        return dd.add(value, unit).toDate();
    };
    Toolbox.prototype.cloneObject = function (object) {
        return JSON.parse(JSON.stringify(object));
    };
    Toolbox.prototype.translateFromObject = function (jsonArray, text, language) {
        var rets = this.filterArrayOfObjects(jsonArray, "key", text);
        var ret = text;
        for (var i = 0; i < rets.length; i++) {
            var values = rets[i].values;
            for (var j = 0; j < values.length; j++) {
                if (values[j].language == language) {
                    ret = values[j].value;
                }
            }
        }
        return ret;
    };
    Toolbox.prototype.translateFromFile = function (text, language, fileName) {
        if (fileName === void 0) { fileName = null; }
        var ret = text;
        // var t = [{
        //     "key": "Bonjour",
        //     "values": [
        //         {
        //             "language": "EN",
        //             "value": "Hello"
        //         },
        //         {
        //             "language": "ES",
        //             "value": "Holà"
        //         }
        //     ]
        // }];
        if (fileName) {
            var data = this.loadFromJsonFile(fileName);
            if (data) {
                ret = this.translateFromObject(data, text, language);
            }
        }
        return ret;
    };
    Toolbox.prototype.jsonToCsv = function (data, title, showLabel, download, separator) {
        if (separator === void 0) { separator = ";"; }
        //If JSONData is not an object then JSON.parse will parse the JSON string in an Object
        var arrData = typeof data != 'object' ? JSON.parse(data) : data;
        var CSV = '';
        //Set Report title in first row or line
        CSV += title + '\r\n\n';
        //This condition will generate the Label/Header
        if (showLabel) {
            var row = "";
            //This loop will extract the label from 1st index of on array
            for (var index in arrData[0]) {
                //Now convert each value to string and comma-seprated
                row += index + separator;
            }
            row = row.slice(0, -1);
            //append Label row with line break
            CSV += row + '\r\n';
        }
        //1st loop is to extract each row
        for (var i = 0; i < arrData.length; i++) {
            var row = "";
            //2nd loop will extract each column and convert it in string comma-seprated
            for (var index in arrData[i]) {
                row += '"' + arrData[i][index] + '"' + separator;
            }
            row.slice(0, row.length - 1);
            //add a line break after each row
            CSV += row + '\r\n';
        }
        if (CSV == '') {
            alert("Invalid data");
            return;
        }
        if (!download) {
            return CSV;
        }
        else {
            //Generate a file name
            var fileName = "report_";
            //this will remove the blank-spaces from the title and replace it with an underscore
            fileName += title.replace(/ /g, "_");
            //Initialize file format you want csv or xls
            var uri = 'data:text/csv;charset=utf-8,' + escape(CSV);
            // Now the little tricky part.
            // you can use either>> window.open(uri);
            // but this will not work in some browsers
            // or you will not get the correct file extension    
            //this trick will generate a temp <a /> tag
            var link = document.createElement("a");
            link.href = uri;
            //set the visibility hidden so it will not effect on your web-layout
            //link.style = "visibility:hidden";
            link.download = fileName + ".csv";
            //this part will append the anchor tag and remove it after automatic click
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    };
    Toolbox.prototype.extractFromArray = function (array, key, value, keepIfNoKey) {
        var ret = [];
        for (var i = 0; i < array.length; i++) {
            if (array[i][key] == undefined) {
                if (keepIfNoKey) {
                    ret.push(array[i]);
                }
            }
            else {
                if (array[i][key] == value) {
                    ret.push(array[i]);
                }
            }
        }
        return ret;
    };
    Toolbox.prototype.noAccent = function (text) {
        var accent = [
            /[\300-\306]/g, /[\340-\346]/g,
            /[\310-\313]/g, /[\350-\353]/g,
            /[\314-\317]/g, /[\354-\357]/g,
            /[\322-\330]/g, /[\362-\370]/g,
            /[\331-\334]/g, /[\371-\374]/g,
            /[\321]/g, /[\361]/g,
            /[\307]/g, /[\347]/g, // C, c
        ];
        var noaccent = ['A', 'a', 'E', 'e', 'I', 'i', 'O', 'o', 'U', 'u', 'N', 'n', 'C', 'c'];
        var str = text.toString();
        if (str && typeof str == "string") {
            for (var i = 0; i < accent.length; i++) {
                str = str.replace(accent[i], noaccent[i]);
            }
        }
        return str;
    };
    Toolbox.prototype.prepareStrinForSearch = function (text, caseSensitive, accentSensitive) {
        var t = text;
        if (!accentSensitive && typeof t == "string") {
            t = this.noAccent(t);
        }
        if (!caseSensitive && typeof t == "string") {
            t = t.toUpperCase();
        }
        return t;
    };
    Toolbox.prototype.compareString = function (text1, text2, caseSensitive, accentSensitive, exactMatching, include) {
        var t1 = this.prepareStrinForSearch(text1, caseSensitive, accentSensitive);
        var t2 = this.prepareStrinForSearch(text2, caseSensitive, accentSensitive);
        if (exactMatching) {
            return text1 == text2;
        }
        else {
            if (include && typeof t1 == "string" && typeof t2 == "string") {
                return t1.indexOf(t2) != -1;
            }
            else {
                return t1 == t2;
            }
        }
    };
    Toolbox.prototype.randomPassword = function () {
        return Math.random().toString(36).slice(-8);
    };
    Toolbox.prototype.getFileNameWithoutExtension = function (fileName) {
        if (fileName && fileName.lastIndexOf('.') > -1) {
            return fileName.substring(0, fileName.lastIndexOf('.'));
        }
        return fileName;
    };
    Toolbox.prototype.addSlashes = function (text) {
        return (text + '')
            .replace(/[\\"']/g, '\\$&')
            .replace(/\u0000/g, '\\0');
    };
    Toolbox.prototype.escapeString = function (text, removeCariageReturn) {
        if (text) {
            try {
                var ret = text.replace(/[\\$'"]/g, "\\$&");
                if (removeCariageReturn) {
                    ret = ret.replace(/[\n\r]+/g, ' ');
                }
                ret = ret.replace(/[\n]+/g, ' ');
                return ret;
            }
            catch (error) {
                return text;
            }
        }
        return text;
    };
    Toolbox.prototype.groupBy = function (array, group) {
        var hash = Object.create(null);
        var result = [];
        array.forEach(function (a) {
            if (!hash[a[group]]) {
                hash[a[group]] = [];
                result.push(hash[a[group]]);
            }
            hash[a[group]].push(a);
        });
        return result;
    };
    Toolbox.prototype.createHeaders = function (data, fieldSeparator, fieldEnclosed, maxFieldSize) {
        if (maxFieldSize === void 0) { maxFieldSize = null; }
        var header = "";
        var firstLine = data[0];
        var keys = Object.keys(firstLine);
        for (var i = 0; i < keys.length; i++) {
            var val = keys[i];
            val = maxFieldSize ? val.substr(0, maxFieldSize) : val;
            header += (header ? fieldSeparator : "") + fieldEnclosed + val + fieldEnclosed;
        }
        return header;
    };
    Toolbox.prototype.jsonToCsvFile = function (data, fieldSeparator, fieldEnclosed, lineSeparator, directory, fileName, maxFieldSize) {
        if (directory === void 0) { directory = null; }
        if (fileName === void 0) { fileName = null; }
        if (maxFieldSize === void 0) { maxFieldSize = null; }
        var ret = "";
        if (data && data.length > 0) {
            if (fileName) {
                var fs = require('fs');
                fs.appendFileSync(directory, this.createHeaders(data, fieldSeparator, fieldEnclosed));
            }
            else {
                ret += this.createHeaders(data, fieldSeparator, fieldEnclosed, maxFieldSize);
            }
            for (var i = 0; i < data.length; i++) {
                var fields_1 = Object.keys(data[i]);
                var line = lineSeparator;
                for (var j = 0; j < fields_1.length; j++) {
                    var value = data[i][fields_1[j]];
                    if (value) {
                        value = value.toString().trim();
                    }
                    else {
                        value = "";
                    }
                    value = maxFieldSize ? value.substr(0, maxFieldSize) : value;
                    line += (line == lineSeparator ? "" : fieldSeparator) + fieldEnclosed + value + fieldEnclosed;
                }
                if (fileName) {
                    fs.appendFileSync(directory + fileName, line);
                }
                else {
                    ret += line;
                }
            }
            var fields = Object.keys(data[0]);
            return { "fields": fields, "csv": ret, "file": directory + fileName };
        }
        return ret;
    };
    // Struture of config: { "host": "localhost", "user": "ftpuser", "password": "ftpuser" }
    Toolbox.prototype.ftpPut = function (callback, config, sourceFileName, destinationDirectory) {
        var Client = require('ftp');
        var c = new Client();
        c.connect(config);
        c.on('ready', function () {
            c.put(sourceFileName, destinationDirectory + sourceFileName, function (error, data) {
                c.end();
                callback(data, error);
            });
        });
    };
    // Struture of filesAndDatas: [{"fileName": "", "data": ""}]
    Toolbox.prototype.writeFileZip = function (callback, filesAndDatas, destinationFileName) {
        if (filesAndDatas && filesAndDatas.length > 0) {
            var jszip = require("jszip");
            var zip = new jszip();
            for (var i = 0; i < filesAndDatas.length; i++) {
                zip.file(filesAndDatas[i].fileName, filesAndDatas[i].data);
            }
            zip.generateAsync({ type: "string", compression: "DEFLATE" }).then(function (content) {
                var fs = require('fs');
                fs.writeFile(destinationFileName, content, 'binary', function (error1, data1) {
                    if (!error1) {
                        data1 = { "destinationFileName": destinationFileName };
                    }
                    callback(data1, error1);
                });
            });
        }
        else {
            callback(null, { "message": "No filesAndDatas as array of file names" });
        }
    };
    Toolbox.prototype.writeFileUnZip = function (callback, sourceFileName, removeZip) {
        if (removeZip === void 0) { removeZip = true; }
        var fs = require('fs');
        var data = fs.readFileSync(sourceFileName);
        var jszip = require("jszip");
        var zip = new jszip();
        zip.loadAsync(data).then(function (contents) {
            var files = [];
            Object.keys(contents.files).forEach(function (filename) {
                zip.file(filename).async('nodebuffer').then(function (content) {
                    fs.writeFileSync(filename, content);
                    files.push(filename);
                    if (files.length == Object.keys(contents.files).length) {
                        if (removeZip) {
                            var fs_1 = require('fs');
                            fs_1.unlinkSync(sourceFileName);
                        }
                        callback(files, null);
                    }
                });
            });
        });
    };
    // Struture of filesAndDatas: [{"fileName": "", "data": ""}]
    Toolbox.prototype.writeFiles = function (filesAndDatas) {
        if (filesAndDatas && filesAndDatas.length > 0) {
            for (var i = 0; i < filesAndDatas.length; i++) {
                var fs = require('fs');
                fs.writeFileSync(filesAndDatas[i].fileName, filesAndDatas[i].data);
            }
            return null;
        }
        else {
            return { "message": "No filesAndDatas as array of file names" };
        }
    };
    // Struture of filesAndDatas: [{"fileName": "", "data": ""}]
    Toolbox.prototype.writeFilesAndPutFtp = function (callback, filesAndDatas, zipDestinationFileName, ftpConfig, ftpDestinationDirectory, zipFileFirst, removeSourceFiles) {
        var _this = this;
        if (zipFileFirst === void 0) { zipFileFirst = true; }
        if (removeSourceFiles === void 0) { removeSourceFiles = true; }
        if (zipFileFirst) {
            this.writeFileZip(function (data, error) {
                if (!error) {
                    _this.ftpPut(function (data1, error1) {
                        if (!error1) {
                            if (removeSourceFiles) {
                                var fs = require('fs');
                                fs.unlinkSync(zipDestinationFileName);
                            }
                        }
                        callback(data1, error1);
                    }, ftpConfig, zipDestinationFileName, ftpDestinationDirectory);
                }
            }, filesAndDatas, zipDestinationFileName);
        }
        else {
            this.writeFiles(filesAndDatas);
            var sent_1 = 0;
            for (var i = 0; i < filesAndDatas.length; i++) {
                this.ftpPut(function (data1, error1) {
                    sent_1++;
                    if (sent_1 == filesAndDatas.length) {
                        if (removeSourceFiles) {
                            var fs = require('fs');
                            for (var i = 0; i < filesAndDatas.length; i++) {
                                fs.unlinkSync(filesAndDatas[i].fileName);
                            }
                        }
                        callback(null, null);
                    }
                }, ftpConfig, filesAndDatas[i].fileName, ftpDestinationDirectory);
            }
        }
    };
    Toolbox.prototype.checksum = function (data, algorithm, encoding) {
        if (algorithm === void 0) { algorithm = null; }
        if (encoding === void 0) { encoding = null; }
        var crypto = require('crypto');
        return crypto
            .createHash(algorithm || 'md5')
            .update(data, 'utf8')
            .digest(encoding || 'hex');
    };
    Toolbox.prototype.checksumFile = function (callback, filePath, algorithm, encoding) {
        var _this = this;
        if (algorithm === void 0) { algorithm = null; }
        if (encoding === void 0) { encoding = null; }
        var fs = require('fs');
        fs.readFile(filePath, function (err, data) {
            var sum = null;
            if (!err) {
                sum = _this.checksum(data, algorithm, encoding);
            }
            callback(sum, err);
        });
    };
    Toolbox.prototype.checksumFileSync = function (filePath, algorithm, encoding) {
        if (algorithm === void 0) { algorithm = null; }
        if (encoding === void 0) { encoding = null; }
        var ret = null;
        var fs = require('fs');
        var data = fs.readFileSync(filePath);
        if (data) {
            ret = this.checksum(data, algorithm, encoding);
        }
        return ret;
    };
    Toolbox.prototype.getWeekDay = function (date) {
        var days = [
            "Sunday",
            "Monday",
            "Tuesday",
            "Wednesday",
            "Thursday",
            "Friday",
            "Saturday"
        ];
        if (date) {
            return days[date.getDay()];
        }
        else {
            return null;
        }
    };
    return Toolbox;
}());
exports.Toolbox = Toolbox;
