"use strict";
exports.__esModule = true;
var dist_1 = require("bdt105toolbox/dist");
var Vidal = (function () {
    function Vidal() {
        this.toolbox = new dist_1.Toolbox();
        this.rest = new dist_1.Rest();
        this.contentType = "text/xml";
        this.configuration = {
            "baseUrl": "http://api.vidal.fr",
            "urlVigie": "http://dev-vidal-memo.vidal.fr/api/memo-rules/rules",
            "apiDomain0": "/excalibur-service/api",
            "apiDomain": "/rest/api",
            "newsDomain": "/rest/news",
            "pmsiDomain": "/rest/pmsi",
            "cim10": "/cim10",
            "allergies": "/allergies",
            "pathologies": "/pathologies",
            "search": "/search",
            "searchAllergies": "/allergies",
            "searchPathologies": "/pathologies",
            "alerts": "/alerts",
            "alertsFull": "/alerts/full",
            "alertsHtml": "/alerts/html",
            "reco": "/reco",
            "version": "/version",
            "postComplement": "/postComplement",
            "indicationGroup": "/indication-group",
            "prescriptionRecos": "/recos/guidelines",
            "adaptedDrugs": "/adapted-drugs",
            "sideEffectSort": "/side-effect/sort-drugs",
            "app_id": "",
            "app_key": "",
            "alertsStyle": false,
            "alertsHtmlStyle": "#main{max-width: 100%} .jquery_tabs ul.tabs-list{width: 20%} .jquery_tabs .content {width: 79%; border: 0px} #main, #sommaire_summary, .grid, .jquery_tabs .content, td {background: transparent}",
            "alertsHtmlStyleHideSidebar": "",
            "alertsHtmlStyleHideHeader": "body {margin-top: 10px}"
        };
        this.frequencyToUnitId = [
            { "key": "PER_24_HOURS", "value": 718 },
            { "key": "PER_DAY", "value": 717 },
            { "key": "PER_HOUR", "value": 716 },
            { "key": "PER_MINUTE", "value": 715 },
            { "key": "PER_MONTH", "value": 721 },
            { "key": "PER_WEEK", "value": 720 },
            { "key": "PER_YEAR", "value": 722 },
            { "key": "THIS_DAY", "value": 714 },
            { "key": "TYPE_44", "value": 725 },
            { "key": "TYPE_66", "value": 724 }
        ];
    }
    Vidal.prototype.setHeaders = function (contentType) {
        if (contentType === void 0) { contentType = "text/xml"; }
        var headers = new Headers();
        headers.append("Content-Type", contentType);
        headers.append("Access-Control-Allow-Origin", "*");
        return headers;
    };
    Vidal.prototype.cleanId = function (id, type) {
        var idd = id + "";
        if (Array.isArray(id)) {
            idd = id[0] + "";
        }
        return idd.replace("vidal://" + type.toLowerCase() + "/", "");
    };
    ;
    Vidal.prototype.callback = function (callback, data, error) {
        if (data._body && (typeof data._body == "string")) {
            if (data._body.startsWith("<?xml version")) {
                data.json = this.toolbox.xml2json(data._body);
            }
            else {
                data.json = this.toolbox.parseJson(data._body);
            }
        }
        if (callback) {
            callback(data, error);
        }
    };
    ;
    Vidal.prototype.getApiBaseUrl = function () {
        var setting = this.toolbox.readFromStorage("setting");
        var url = this.configuration.baseUrl;
        if (setting && setting.vidalBaseUrl) {
            url = setting.vidalBaseUrl;
        }
        return url;
    };
    ;
    Vidal.prototype.getHtmlStyle = function () {
        var setting = this.toolbox.readFromStorage("setting");
        var htmlStyle = this.configuration.alertsStyle;
        if (setting && setting.vidalHtmlStyle) {
            htmlStyle = setting.vidalHtmlStyle;
        }
        return htmlStyle;
    };
    ;
    Vidal.prototype.getApp_key = function () {
        return this.configuration.app_key;
    };
    ;
    Vidal.prototype.getApp_id = function () {
        return this.configuration.app_id;
    };
    ;
    Vidal.prototype.getUrlCredentials = function (prefix) {
        return prefix + "app_id=" + this.getApp_id() + "&app_key=" + this.getApp_key();
    };
    Vidal.prototype.search = function (callback, params) {
        if (params && params.length > 2) {
            var url = this.getApiBaseUrl() + this.configuration.apiDomain + this.configuration.search + "?q=" + params + this.getUrlCredentials("&");
            this.rest.call(function (data, error) { return callback(data, error); }, "GET", url, null, this.contentType);
        }
    };
    Vidal.prototype.searchAllergies = function (callback, params) {
        if (params && params.length > 2) {
            var url = this.getApiBaseUrl() + this.configuration.apiDomain + this.configuration.searchAllergies + "?q=" + params + this.getUrlCredentials("&");
            this.rest.call(function (data, error) { return callback(data, error); }, "GET", url, null, this.contentType);
        }
    };
    Vidal.prototype.getProducts = function (params, filter) {
        var _this = this;
        if (params && params.length > 2) {
            var url = this.getApiBaseUrl() + this.configuration.apiDomain + this.configuration.search + "?q=" + params + "&filter=" + filter + this.getUrlCredentials("&");
            this.rest.call(function (data, error) { return _this.callback(null, data, error); }, "GET", url, null, this.contentType);
        }
    };
    Vidal.prototype.getAllergies = function (params) {
        var _this = this;
        if (params && params.length > 2) {
            var url = this.getApiBaseUrl() + this.configuration.apiDomain + this.configuration.searchAllergies + "?q=" + params + this.getUrlCredentials("&");
            this.rest.call(function (data, error) { return _this.callback(null, data, error); }, "GET", url, null, this.contentType);
        }
    };
    Vidal.prototype.getPathologies = function (params) {
        var _this = this;
        if (params && params.length > 2) {
            var url = this.getApiBaseUrl() + this.configuration.apiDomain + this.configuration.searchPathologies + "?q=" + params + this.getUrlCredentials("&");
            this.rest.call(function (data, error) { return _this.callback(null, data, error); }, "GET", url, null, this.contentType);
        }
    };
    Vidal.prototype.searchPathologies = function (callbackSuccess, callbackFailure, params) {
        var _this = this;
        if (params && params.length > 2) {
            var url = this.getApiBaseUrl() + this.configuration.apiDomain + this.configuration.searchPathologies + "?q=" + params + this.getUrlCredentials("&");
            this.rest.call(function (data, error) { return _this.callback(null, data, error); }, "GET", url, null, this.contentType);
        }
    };
    Vidal.prototype.getFromId = function (callbackSuccess, callbackFailure, type, id) {
        var _this = this;
        if (type && id) {
            var url = this.getApiBaseUrl() + this.configuration.apiDomain + "/" + type + "/" + id + this.getUrlCredentials("?");
            this.rest.call(function (data, error) { return _this.callback(null, data, error); }, "GET", url, null, this.contentType);
        }
    };
    ;
    Vidal.prototype.getPrescriptionUnits = function (callbackSuccess, callbackFailure, type, id) {
        var _this = this;
        if (type && id) {
            var url = this.getApiBaseUrl() + this.configuration.apiDomain + "/" + type + "/" + id + "/units" + this.getUrlCredentials("?");
            this.rest.call(function (data, error) { return _this.callback(null, data, error); }, "GET", url, null, this.contentType);
        }
    };
    ;
    Vidal.prototype.getPrescriptionRoutes = function (callbackSuccess, callbackFailure, type, id) {
        var _this = this;
        if (type && id) {
            var url = this.getApiBaseUrl() + this.configuration.apiDomain + "/" + type + "/" + id + "/routes" + this.getUrlCredentials("?");
            this.rest.call(function (data, error) { return _this.callback(null, data, error); }, "GET", url, null, this.contentType);
        }
    };
    ;
    Vidal.prototype.getIndications = function (callbackSuccess, callbackFailure, type, id) {
        var _this = this;
        if (type && id) {
            var url = this.getApiBaseUrl() + this.configuration.apiDomain + "/" + type + "/" + id + "/indications" + this.getUrlCredentials("?");
            this.rest.call(function (data, error) { return _this.callback(null, data, error); }, "GET", url, null, this.contentType);
        }
    };
    ;
    Vidal.prototype.getPrescriptionLineXml = function (prescriptionLine) {
        var xml = "<prescription-line>";
        xml += "<drug>vidal://" + prescriptionLine.productType + "/" + prescriptionLine.productId + "</drug>";
        // xml += "<drugId>" + prescriptionLine.productId + "</drugId>";
        // xml += "<drugType>" + (prescriptionLine.productType == "package" ? "PACK" : prescriptionLine.productType.toUpperCase()) + "</drugType>";
        xml += "<dose>" + prescriptionLine.dose + "</dose>";
        xml += "<unitId>" + prescriptionLine.unitId + "</unitId>";
        xml += "<duration>" + prescriptionLine.duration + "</duration>";
        xml += "<durationType>" + prescriptionLine.durationType + "</durationType>";
        xml += "<frequencyType>" + prescriptionLine.frequencyType + "</frequencyType>";
        xml += (prescriptionLine.routeId ? "<routes><route>vidal://route/" + prescriptionLine.routeId + "</route></routes>" : "");
        xml += (prescriptionLine.indicationId && prescriptionLine.indicationId != "" ? "<indications><indication>vidal://indication/" + prescriptionLine.indicationId + "</indication></indications>" : "");
        return xml + "</prescription-line>";
    };
    Vidal.prototype.getBasicPatientXml = function (patient) {
        var xml = "";
        if (patient) {
            xml += patient.dateOfBirth ? ("<dateOfBirth>" + patient.dateOfBirth.replace(" ", "T") + "</dateOfBirth>") : "";
            xml += "<gender>" + patient.gender + "</gender>";
            xml += "<weight>" + patient.weight + "</weight>";
            xml += "<height>" + patient.height + "</height>";
            xml += patient.breastFeeding && patient.breastFeeding != "" && patient.breastFeeding != "-1" ? "<breastFeeding>" + patient.breastFeeding + "</breastFeeding>" : "";
            xml += patient.weeksOfAmenorrhea && patient.weeksOfAmenorrhea != "" && patient.weeksOfAmenorrhea != "-1" ? "<weeksOfAmenorrhea>" + patient.weeksOfAmenorrhea + "</weeksOfAmenorrhea>" : "";
            xml += patient.creatin && patient.creatin != "" && patient.creatin != null && patient.creatin != "-1" ? "<creatin>" + patient.creatin + "</creatin>" : "";
            xml += patient.hepaticInsufficiency && patient.hepaticInsufficiency != "" ? "<hepaticInsufficiency>" + patient.hepaticInsufficiency + "</hepaticInsufficiency>" : "";
        }
        return xml;
    };
    Vidal.prototype.getPatientXml = function (patient) {
        if (patient) {
            var xml = "<patient>";
            var arr = [];
            xml += this.getBasicPatientXml(patient);
            if (patient.allergyIds && patient.allergyIds.length > 0) {
                var all = patient.allergyIds.split("|");
                if (patient.allergyIds.length > 0) {
                    xml += "<allergies>";
                    for (var i = 0; i < all.length; i++) {
                        xml += "<allergy>vidal://allergy/" + all[i] + "</allergy>";
                    }
                    xml += "</allergies>";
                }
            }
            if (patient.moleculeIds && patient.moleculeIds.length > 0) {
                var all = patient.moleculeIds.split("|");
                if (patient.moleculeIds.length > 0) {
                    xml += "<molecules>";
                    for (var i = 0; i < all.length; i++) {
                        xml += "<molecule>vidal://molecule/" + all[i] + "</molecule>";
                    }
                    xml += "</molecules>";
                }
            }
            if (patient.cim10Ids && patient.cim10Ids.length > 0) {
                var all = patient.cim10Ids.split("|");
                if (patient.cim10Ids.length > 0) {
                    xml += "<pathologies>";
                    for (var i = 0; i < all.length; i++) {
                        xml += "<pathology>vidal://cim10/" + all[i] + "</pathology>";
                    }
                    xml += "</pathologies>";
                }
            }
            return xml + "</patient>";
        }
        return "";
    };
    Vidal.prototype.getPrescriptionXml = function (prescription) {
        if (prescription) {
            var ret = "<?xml version='1.0' encoding='UTF-8' standalone='yes'?><prescription>";
            var xmlLines = "<prescription-lines>";
            if (prescription.lines) {
                for (var i = 0; i < prescription.lines.length; i++) {
                    xmlLines += this.getPrescriptionLineXml(prescription.lines[i]);
                }
            }
            xmlLines += "</prescription-lines>";
            var xmlPatient = prescription.patient ? this.getPatientXml(prescription.patient) : "";
            return ret + xmlPatient + xmlLines + "</prescription>";
        }
        return "";
    };
    Vidal.prototype.getAlerts = function (callback, prescription, params, type) {
        if (prescription && prescription.lines && prescription.lines.length > 0) {
            params.body = this.getPrescriptionXml(prescription);
            this.toolbox.log(params.body);
            params.url = this.getApiBaseUrl() + this.configuration.apiDomain +
                (type == "html" ? this.configuration.alertsHtml : this.configuration.alertsFull) + this.getUrlCredentials("?");
            this.rest.call(function (data, error) { return callback(null, data, error); }, "POST", params.url, params.body, this.contentType);
        }
    };
    Vidal.prototype.getAlertColor = function (severity) {
        var color = { "background": "red", "font": "" };
        switch (severity) {
            case "LEVEL_1":
                color.background = "yellow";
                color.font = "black";
                break;
            case "LEVEL_2":
                color.background = "orange";
                color.font = "white";
                break;
            case "LEVEL_3":
                color.background = "#FF4326";
                color.font = "white";
                break;
            case "LEVEL_4":
                color.background = "red";
                color.font = "white";
                break;
            case "INFO":
                color.background = "#b1b1b1";
                color.font = "black";
                break;
            default:
                break;
        }
        return color;
    };
    Vidal.prototype.getRelevantAlerts = function (alert) {
        var als = [];
        if (alert) {
            if (alert["vidal:maxAllergySeverity"] && alert["vidal:maxAllergySeverity"][0].severity[0] != "NO_ALERT") {
                alert["vidal:maxAllergySeverity"].tag = "ALL";
                alert["vidal:maxAllergySeverity"].color = this.getAlertColor(alert["vidal:maxAllergySeverity"][0].severity[0]);
                als.push(alert["vidal:maxAllergySeverity"]);
            }
            if (alert["vidal:maxContraIndicationSeverity"] && alert["vidal:maxContraIndicationSeverity"][0].severity[0] != "NO_ALERT") {
                alert["vidal:maxContraIndicationSeverity"].tag = "CTI";
                alert["vidal:maxContraIndicationSeverity"].color = this.getAlertColor(alert["vidal:maxContraIndicationSeverity"][0].severity[0]);
                als.push(alert.maxContraIndicationSeverity);
            }
            if (alert["vidal:maxDrugDrugInteractionsSeverity"] && alert["vidal:maxDrugDrugInteractionsSeverity"][0].severity[0] != "NO_ALERT") {
                alert["vidal:maxDrugDrugInteractionsSeverity"].tag = "INT";
                alert["vidal:maxDrugDrugInteractionsSeverity"].color = this.getAlertColor(alert["vidal:maxDrugDrugInteractionsSeverity"][0].severity[0]);
                als.push(alert["vidal:maxDrugDrugInteractionsSeverity"]);
            }
            if (alert["vidal:maxPhysicoChemicalSeverity"] && alert["vidal:maxPhysicoChemicalSeverity"][0].severity[0] != "NO_ALERT") {
                alert["vidal:maxPhysicoChemicalSeverity"].tag = "PCI";
                alert["vidal:maxPhysicoChemicalSeverity"].color = this.getAlertColor(alert["vidal:maxPhysicoChemicalSeverity"][0].severity[0]);
                als.push(alert["vidal:maxPhysicoChemicalSeverity"]);
            }
            if (alert["vidal:maxPosologySeverity"] && alert["vidal:maxPosologySeverity"][0].severity[0] != "NO_ALERT") {
                alert["vidal:maxPosologySeverity"].tag = "POS";
                alert["vidal:maxPosologySeverity"].color = this.getAlertColor(alert["vidal:maxPosologySeverity"][0].severity[0]);
                als.push(alert["vidal:maxPosologySeverity"]);
            }
            if (alert["vidal:maxPrecautionSeverity"] && alert["vidal:maxPrecautionSeverity"][0].severity[0] != "NO_ALERT") {
                alert["vidal:maxPrecautionSeverity"].tag = "PRS";
                alert["vidal:maxPrecautionSeverity"].color = this.getAlertColor(alert["vidal:maxPrecautionSeverity"][0].severity[0]);
                als.push(alert["vidal:maxPrecautionSeverity"]);
            }
            if (alert["vidal:maxProcreationSeverity"] && alert["vidal:maxProcreationSeverity"][0].severity[0] != "NO_ALERT") {
                alert["vidal:maxProcreationSeverity"].tag = "PRO";
                alert["vidal:maxProcreationSeverity"].color = this.getAlertColor(alert["vidal:maxProcreationSeverity"][0].severity[0]);
                als.push(alert["vidal:maxProcreationSeverity"]);
            }
            if (alert["vidal:maxRedundantInteractionsSeverity"] && alert["vidal:maxRedundantInteractionsSeverity"][0].severity[0] != "NO_ALERT") {
                alert["vidal:maxRedundantInteractionsSeverity"].tag = "RED";
                alert["vidal:maxRedundantInteractionsSeverity"].color = this.getAlertColor(alert["vidal:maxRedundantInteractionsSeverity"][0].severity[0]);
                als.push(alert["vidal:maxRedundantInteractionsSeverity"]);
            }
        }
        return als;
    };
    Vidal.prototype.assignAlertsToLines = function (prescription, xmlAlerts) {
        if (prescription && xmlAlerts && xmlAlerts.feed && xmlAlerts.feed.entry) {
            for (var i = 0; i < prescription.lines.length; i++) {
                var line = prescription.lines[i];
                line.alertSummary = [];
                for (var j = 0; j < xmlAlerts.feed.entry.length; j++) {
                    var alert = xmlAlerts.feed.entry[j];
                    if (alert.id[0].startsWith("vidal://prescription_line")) {
                        if (alert["vidal:drugId"][0] == line.productId) {
                            line.alertSummary = this.getRelevantAlerts(alert);
                        }
                    }
                }
            }
        }
    };
    Vidal.prototype.addStyleToHtml = function (text, hideSidebar, hideHeader) {
        if (text && this.getHtmlStyle()) {
            var style = "<style>";
            style += " " + this.configuration.alertsHtmlStyle;
            if (hideSidebar) {
                style += this.configuration.alertsHtmlStyleHideSidebar;
            }
            if (hideHeader) {
                style += " " + this.configuration.alertsHtmlStyleHideHeader;
            }
            style += "</style>";
            return text.replace("<!-- custom-css -->", style);
        }
        return text;
    };
    ;
    Vidal.prototype.getOptDocument = function (callback, type, id) {
        if (type && id) {
            var url = this.getApiBaseUrl() + this.configuration.apiDomain + "/" + type + "/" + id + "/documents/opt" + this.getUrlCredentials("?");
            this.rest.call(function (data, error) { return callback(data, error); }, "GET", url, null, this.contentType);
        }
    };
    Vidal.prototype.getDocuments = function (callback, type, id, params) {
        if (type && id) {
            params.url = this.getApiBaseUrl() + this.configuration.apiDomain + "/" + type + "/" + id + "/documents" + this.getUrlCredentials("?");
            this.rest.call(function (data, error) { return callback(data, error); }, "GET", params.url, null, this.contentType);
        }
    };
    Vidal.prototype.getATCClassFromProduct = function (callback, type, id) {
        if (type && id) {
            var url = this.getApiBaseUrl() + this.configuration.apiDomain + "/" + type + "/" + id + "/atc-classification" + this.getUrlCredentials("?");
            this.rest.call(function (data, error) { return callback(data, error); }, "GET", url, null, this.contentType);
        }
    };
    Vidal.prototype.getVIDALClassFromProduct = function (callback, type, id) {
        if (type && id) {
            var url = this.getApiBaseUrl() + this.configuration.apiDomain + "/" + type + "/" + id + "/vidal-classification" + this.getUrlCredentials("?");
            this.rest.call(function (data, error) { return callback(data, error); }, "GET", url, null, this.contentType);
        }
    };
    Vidal.prototype.getProduct = function (callback, type, id) {
        if (type && id) {
            var url = this.getApiBaseUrl() + this.configuration.apiDomain + "/" + type + "/" + id + this.getUrlCredentials("?");
            this.rest.call(function (data, error) { return callback(data, error); }, "GET", url, null, this.contentType);
        }
    };
    Vidal.prototype.getVigieAlerts = function (callback, prescription) {
        if (prescription && prescription.patient) {
            var arr = prescription.patient.dateOfBirth.split("-");
            var today = new Date();
            var ageYears = today.getFullYear() - arr[0];
            var prescs = [];
            if (prescription.lines && prescription.lines.length > 0) {
                var atcs = [];
                var vidals = [];
                for (var i = 0; i < prescription.lines.length; i++) {
                    var presc = { "atcs": new Array(), "vidalClasses": new Array(), "galenicForms": new Array(), "indications": new Array(), "routes": new Array() };
                    if (prescription.lines[i].atcClass) {
                        presc.atcs.push(prescription.lines[i].atcClass);
                    }
                    if (prescription.lines[i].vidalClass) {
                        presc.vidalClasses.push(prescription.lines[i].vidalClass);
                    }
                    if (prescription.lines[i].galenicFormId) {
                        presc.galenicForms.push(prescription.lines[i].galenicFormId);
                    }
                    if (prescription.lines[i].routeId) {
                        presc.routes.push(prescription.lines[i].routeId);
                    }
                    prescs.push(presc);
                }
            }
            var body = { "age": ageYears, "prescriptions": prescs };
            this.toolbox.log(JSON.stringify(body));
            var url = this.configuration.urlVigie; // + this.getUrlCredentials("?");
            this.rest.call(function (data, error) { return callback(data, error); }, "POST", url, JSON.stringify(body), "application/json");
        }
    };
    Vidal.prototype.getNewsFromProduct = function (callback, type, id) {
        if (type && id && (type == "product" || type == "package")) {
            var url = this.getApiBaseUrl() + this.configuration.newsDomain + "/" + type + "/" + id + this.getUrlCredentials("?");
            this.rest.call(function (data, error) { return callback(data, error); }, "GET", url, null, this.contentType);
        }
    };
    Vidal.prototype.getPosologyXml = function (patient, routeIds, indicationIds) {
        var routes = "";
        var indications = "";
        var xmlPatient = '<patient>' + this.getBasicPatientXml(patient) + '</patient>';
        if (routeIds && routeIds.length > 0) {
            routes = '<routes>';
            for (var i = 0; i < routeIds.length; i++) {
                routes += '<route>vidal://route/' + routeIds[i] + '</route>';
            }
            routes += '</routes>';
        }
        if (indicationIds && indicationIds.length > 0) {
            indications = '<indications>';
            for (var i = 0; i < indicationIds.length; i++) {
                indications += '<indication>vidal://indication/' + indicationIds[i] + '</indication>';
            }
            indications += '</indications>';
        }
        return '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><posology-request>' + xmlPatient + routes + indications + '</posology-request>';
    };
    Vidal.prototype.getPosologyFromProduct = function (callback, type, id, patient, routeIds, indicationIds, params) {
        if (type && id && patient) {
            params.url = this.getApiBaseUrl() + this.configuration.apiDomain + "/" + type + "/" + id + "/posology-descriptors" + this.getUrlCredentials("?");
            params.body = this.getPosologyXml(patient, routeIds, indicationIds);
            this.rest.call(function (data, error) { return callback(data, error); }, "POST", params.url, params.body, this.contentType);
        }
    };
    Vidal.prototype.getUnitIdFromFrequency = function (stringFrequency) {
        var fil = this.frequencyToUnitId.filter(function (row) { return row.key == stringFrequency; });
        return fil[0].value;
    };
    Vidal.prototype.getFrequencyFromUnitId = function (unitId) {
        if (unitId) {
            var fil = this.frequencyToUnitId.filter(function (row) { return row.value == unitId; });
            return fil[0].key;
        }
        else {
            return "";
        }
    };
    Vidal.prototype.getPostComplementXml = function (drugs, icd10Codes, text) {
        var ret = '<?xml version="1.0" encoding="UTF-8"?><request>';
        if (drugs && drugs.length > 0) {
            ret += "<drugs>";
            for (var i = 0; i < drugs.length; i++) {
                ret += "<id>" + drugs[i] + "</id>";
            }
            ret += "</drugs>";
        }
        if (icd10Codes && icd10Codes.length > 0) {
            ret += "<codesToControl>";
            for (var i = 0; i < icd10Codes.length; i++) {
                ret += "<codeToControl>" + icd10Codes[i] + "</codeToControl>";
            }
            ret += "</codesToControl>";
        }
        if (text && text.length > 0) {
            ret += "<text>" + text + "</text>";
        }
        ret += "<engine>VIDAL</engine><drugCursor>DEFAULT</drugCursor></request>";
        return ret;
    };
    Vidal.prototype.getPostComplement = function (callback, drugs, icd10Codes, text, params) {
        if ((drugs && drugs.length > 0) || (text && text.length > 0)) {
            params.url = this.getApiBaseUrl() + this.configuration.pmsiDomain + this.configuration.postComplement + this.getUrlCredentials("?");
            params.body = this.getPostComplementXml(drugs, icd10Codes, text);
            this.rest.call(function (data, error) { return callback(data, error); }, "POST", params.url, params.body, this.contentType);
        }
    };
    Vidal.prototype.getCim10FromIndicationGroupId = function (callback, id) {
        if (id) {
            var url = this.getApiBaseUrl() + this.configuration.apiDomain + this.configuration.indicationGroup + "/" + id + "/cim10s" + this.getUrlCredentials("?");
            this.rest.call(function (data, error) { return callback(data, error); }, "GET", url, null, this.contentType);
        }
    };
    Vidal.prototype.getRecosFromIndicationGroupId = function (callback, id) {
        if (id) {
            var url = this.getApiBaseUrl() + this.configuration.apiDomain + this.configuration.indicationGroup + "/" + id + "/recos" + this.getUrlCredentials("?");
            this.rest.call(function (data, error) { return callback(data, error); }, "GET", url, null, this.contentType);
        }
    };
    Vidal.prototype.getPrescriptionRecos = function (callback, prescription, params) {
        params.body = this.getPrescriptionXml(prescription);
        params.url = this.getApiBaseUrl() + this.configuration.apiDomain + this.configuration.prescriptionRecos + this.getUrlCredentials("?");
        this.toolbox.log(prescription.xmlBody);
        this.rest.call(function (data, error) { return callback(data, error); }, "POST", params.url, params.body, this.contentType);
    };
    Vidal.prototype.getRecoUrl = function (id) {
        return this.getApiBaseUrl() + this.configuration.apiDomain + this.configuration.reco + "/" + id + "/html" + this.getUrlCredentials("?");
    };
    Vidal.prototype.getReco = function (callback, id) {
        this.rest.call(function (data, error) { return callback(data, error); }, "GET", this.getRecoUrl(id), null, this.contentType);
    };
    Vidal.prototype.getAdaptedDugsXml = function (vmpId, facets, page, pageSize) {
        var ret = "<adapted-drugs>";
        ret += "<vmp-id>" + vmpId + "</vmp-id>";
        ret += "<output-drug-type>PRODUCT</output-drug-type>";
        ret += "<facets>";
        if (facets) {
            for (var i = 0; i < facets.length; i++) {
                if (facets[i].active) {
                    ret += "<facet name=\"" + facets[i]["vidal:facetName"][0].name[0] + "\" value=\"" + facets[i]["vidal:facetValue"][0] + "\"/>";
                }
            }
        }
        ret += "</facets>";
        ret += "<start-page>" + page + "</start-page>";
        ret += "<page-size>" + pageSize + "</page-size>";
        ret += "</adapted-drugs>";
        return ret;
    };
    Vidal.prototype.getAdaptedDrugs = function (callback, vmpId, facets, page, pageSize, params) {
        if (vmpId) {
            params.body = this.getAdaptedDugsXml(vmpId, facets, page, pageSize);
            params.url = this.getApiBaseUrl() + this.configuration.apiDomain + this.configuration.adaptedDrugs + this.getUrlCredentials("?");
            this.toolbox.log(params.xmlBody);
            this.rest.call(function (data, error) { return callback(data, error); }, "POST", params.url, params.body, this.contentType);
        }
    };
    Vidal.prototype.getSideEffectsXml = function (drugs, sideEffectId) {
        var ret = "<?xml version='1.0' encoding='UTF-8' standalone='yes'?><adapted-drugs>";
        ret += "<request>";
        ret += "<ids>";
        if (drugs) {
            for (var i = 0; i < drugs.length; i++) {
                ret += "<id>" + drugs[i] + "</id>";
            }
        }
        ret += "</ids>";
        ret += "<sideEffectId>" + sideEffectId + "</sideEffectId>";
        ret += "</request>";
        return ret;
    };
    Vidal.prototype.getSideEffects = function (callback, drugs, sideEffectId, params) {
        if (sideEffectId) {
            params.body = this.getSideEffectsXml(drugs, sideEffectId);
            params.url = this.getApiBaseUrl() + this.configuration.apiDomain + this.configuration.sideEffectSort + this.getUrlCredentials("?");
            this.toolbox.log(params.xmlBody);
            this.rest.call(function (data, error) { return callback(data, error); }, "POST", params.url, params.body, this.contentType);
        }
    };
    Vidal.prototype.getVigieHtml = function (data, title) {
        if (data.json && data.json.feed && data.json.feed.entry) {
            var html = "";
            for (var i = 0; i < data.json.feed.entry.length; i++) {
                var entry = data.json.feed.entry[i];
                //html += "<h4>" + entry.title + "</h4>";
                html += entry.summary;
            }
            return "<div class='notificationVigie'><h1>" + title + "</h1>" + html + "</div>";
        }
    };
    Vidal.prototype.getVersion = function (callback, params, credentials) {
        if (credentials === void 0) { credentials = null; }
        params.url = this.getApiBaseUrl() + this.configuration.apiDomain + this.configuration.version + (credentials ? "?" + credentials : this.getUrlCredentials("?"));
        this.rest.call(function (data, error) { return callback(data, error); }, "GET", params.url, null, this.contentType);
    };
    Vidal.prototype.flattenObject = function (object) {
        if (object.isArray()) {
            if (object.length == 1) {
                if (typeof object[0] == "string") {
                    return object[0];
                }
                else {
                    if (object[0]["_"]) {
                        return object[0]["_"];
                    }
                }
            }
        }
        if (object["_"] == "string") {
            return object["_"];
        }
        return object;
    };
    return Vidal;
}());
exports.Vidal = Vidal;
