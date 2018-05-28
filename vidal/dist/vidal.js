"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const dist_1 = require("bdt105toolbox/dist");
class Vidal {
    constructor(app_id = "", app_key = "") {
        this.toolbox = new dist_1.Toolbox();
        this.rest = new dist_1.Rest();
        this.contentType = "text/xml";
        this.configuration = {
            "baseUrl": "http://api.vidal.fr",
            "urlVigie": "http://dev-vidal-memo.vidal.fr/api/memo-rules/rules",
            "drugInteractionClassWsdl": "http://apisoap-demo.vidal.fr/soap/DrugInteractionClassService?wsdl",
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
            "postControl": "/postControl",
            "indicationGroup": "/indication-group",
            "prescriptionRecos": "/recos/guidelines",
            "adaptedDrugs": "/adapted-drugs",
            "sideEffectSort": "/side-effect/sort-drugs",
            "app_id": "",
            "app_key": "",
            "alertsStyle": false,
            "alertsHtmlStyle": "#main{max-width: 100%} .jquery_tabs ul.tabs-list{width: 20%} .jquery_tabs .content {width: 79%; border: 0px} #main, #sommaire_summary, .grid, .jquery_tabs .content, td {background: transparent}",
            "alertsHtmlStyleHideSidebar": "",
            "alertsHtmlStyleHideHeader": "body {margin-top: 10px}",
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
        this.configuration.app_id = app_id;
        this.configuration.app_key = app_key;
    }
    setHeaders(contentType = "text/xml") {
        var headers = new Headers();
        headers.append("Content-Type", contentType);
        headers.append("Access-Control-Allow-Origin", "*");
        return headers;
    }
    cleanId(id, type) {
        var idd = id + "";
        if (Array.isArray(id)) {
            idd = id[0] + "";
        }
        return idd.replace("vidal://" + type.toLowerCase() + "/", "");
    }
    ;
    callback(callback, data, error) {
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
    }
    ;
    getApiBaseUrl() {
        var setting = null;
        var url = this.configuration.baseUrl;
        try {
            setting = this.toolbox.readFromStorage("setting");
            if (setting && setting.vidalBaseUrl) {
                url = setting.vidalBaseUrl;
            }
        }
        catch (e) {
        }
        return url;
    }
    ;
    getApiDomain() {
        var setting = null;
        var apiDomain = this.configuration.apiDomain;
        try {
            setting = this.toolbox.readFromStorage("setting");
            if (setting && setting.vidalApiDomain) {
                apiDomain = setting.vidalApiDomain;
            }
        }
        catch (e) {
        }
        return apiDomain;
    }
    ;
    getHtmlStyle() {
        var setting = null;
        var htmlStyle = this.configuration.alertsStyle;
        try {
            var setting = this.toolbox.readFromStorage("setting");
        }
        catch (e) {
        }
        if (setting && setting.vidalHtmlStyle) {
            htmlStyle = setting.vidalHtmlStyle;
        }
        return htmlStyle;
    }
    ;
    getApp_key() {
        return this.configuration.app_key;
    }
    ;
    getApp_id() {
        return this.configuration.app_id;
    }
    ;
    getUrlCredentials(prefix, app_id = null, app_key = null) {
        return prefix + "app_id=" + (app_id ? app_id : this.getApp_id()) + "&app_key=" + (app_key ? app_key : this.getApp_key());
    }
    search(callback, searchTerm) {
        if (searchTerm && searchTerm.length > 2) {
            var url = this.getApiBaseUrl() + this.getApiDomain() + this.configuration.search + "?q=" + searchTerm + this.getUrlCredentials("&");
            this.rest.call((data, error) => callback(data, error), "GET", url, null, this.contentType, true);
        }
    }
    searchByCode(callback, code) {
        if (code && code.length > 2) {
            var url = this.getApiBaseUrl() + this.getApiDomain() + this.configuration.search + "?code=" + code + this.getUrlCredentials("&");
            this.rest.call((data, error) => callback(data, error), "GET", url, null, this.contentType, true);
        }
    }
    searchAllergies(callback, params) {
        if (params && params.length > 2) {
            var url = this.getApiBaseUrl() + this.getApiDomain() + this.configuration.searchAllergies + "?q=" + params + this.getUrlCredentials("&");
            this.rest.call((data, error) => callback(data, error), "GET", url, null, this.contentType, true);
        }
    }
    getProducts(callback, params, filter) {
        if (params && params.length > 2) {
            var url = this.getApiBaseUrl() + this.getApiDomain() + this.configuration.search + "?q=" + params + "&filter=" + filter + this.getUrlCredentials("&");
            this.rest.call((data, error) => callback(data, error), "GET", url, null, this.contentType, true);
        }
    }
    getAllergies(callback, params) {
        if (params && params.length > 2) {
            var url = this.getApiBaseUrl() + this.getApiDomain() + this.configuration.searchAllergies + "?q=" + params + this.getUrlCredentials("&");
            this.rest.call((data, error) => callback(data, error), "GET", url, null, this.contentType, true);
        }
    }
    getPathologies(callback, params) {
        if (params && params.length > 2) {
            var url = this.getApiBaseUrl() + this.getApiDomain() + this.configuration.searchPathologies + "?q=" + params + this.getUrlCredentials("&");
            this.rest.call((data, error) => callback(data, error), "GET", url, null, this.contentType, true);
        }
    }
    searchPathologies(callback, params) {
        if (params && params.length > 2) {
            var url = this.getApiBaseUrl() + this.getApiDomain() + this.configuration.searchPathologies + "?q=" + params + this.getUrlCredentials("&");
            this.rest.call((data, error) => callback(data, error), "GET", url, null, this.contentType, true);
        }
    }
    getFromId(callback, type, id) {
        if (type && id) {
            let url = this.getApiBaseUrl() + this.getApiDomain() + "/" + type + "/" + id + this.getUrlCredentials("?");
            this.rest.call((data, error) => callback(data, error), "GET", url, null, this.contentType, true);
        }
    }
    ;
    getPrescriptionUnits(callback, type, id) {
        if (type && id) {
            let url = this.getApiBaseUrl() + this.getApiDomain() + "/" + type + "/" + id + "/units" + this.getUrlCredentials("?");
            this.rest.call((data, error) => callback(data, error), "GET", url, null, this.contentType, true);
        }
    }
    ;
    getPrescriptionRoutes(callback, type, id) {
        if (type && id) {
            let url = this.getApiBaseUrl() + this.getApiDomain() + "/" + type + "/" + id + "/routes" + this.getUrlCredentials("?");
            this.rest.call((data, error) => callback(data, error), "GET", url, null, this.contentType, true);
        }
    }
    ;
    getIndications(callback, type, id) {
        if (type && id) {
            let url = this.getApiBaseUrl() + this.getApiDomain() + "/" + type + "/" + id + "/indications" + this.getUrlCredentials("?");
            this.rest.call((data, error) => callback(data, error), "GET", url, null, this.contentType, true);
        }
    }
    ;
    getPrescriptionLineXml(prescriptionLine) {
        var xml = "<prescription-line>";
        xml += "<drug>vidal://" + prescriptionLine.productType + "/" + prescriptionLine.productId + "</drug>";
        // xml += "<drugId>" + prescriptionLine.productId + "</drugId>";
        // xml += "<drugType>" + (prescriptionLine.productType == "package" ? "PACK" : prescriptionLine.productType.toUpperCase()) + "</drugType>";
        xml += "<dose>" + (prescriptionLine.dose ? prescriptionLine.dose : "") + "</dose>";
        xml += "<unitId>" + (prescriptionLine.unitId ? prescriptionLine.unitId : "") + "</unitId>";
        xml += "<duration>" + (prescriptionLine.duration ? prescriptionLine.duration : "") + "</duration>";
        xml += "<durationType>" + (prescriptionLine.durationType ? prescriptionLine.durationType : "") + "</durationType>";
        xml += "<frequencyType>" + (prescriptionLine.frequencyType ? prescriptionLine.frequencyType : "") + "</frequencyType>";
        xml += (prescriptionLine.routeId ? "<routes><route>vidal://route/" + prescriptionLine.routeId + "</route></routes>" : "");
        xml += (prescriptionLine.indicationId && prescriptionLine.indicationId != "" ? "<indications><indication>vidal://indication/" + prescriptionLine.indicationId + "</indication></indications>" : "");
        if (prescriptionLine.complexSchema == 1 && prescriptionLine.dosages) {
            xml += "<dosages>";
            for (var i = 0; i < prescriptionLine.dosages.length; i++) {
                xml += "<dosage>";
                xml += "<dose>" + (prescriptionLine.dosages[i].dose ? prescriptionLine.dosages[i].dose : "") + "</dose>";
                xml += "<unitId>" + (prescriptionLine.dosages[i].unitId ? prescriptionLine.dosages[i].unitId : "") + "</unitId>";
                if (prescriptionLine.dosages[i].interval) {
                    xml += "<interval>";
                    xml += "<min>" + (prescriptionLine.dosages[i].interval.min ? prescriptionLine.dosages[i].interval.min : "") + "</min>";
                    xml += "<max>" + (prescriptionLine.dosages[i].interval.max ? prescriptionLine.dosages[i].interval.max : "") + "</max>";
                    xml += "<unitId>" + (prescriptionLine.dosages[i].interval.unitId ? prescriptionLine.dosages[i].interval.unitId : "") + "</unitId>";
                    xml += "</interval>";
                }
                xml += "</dosage>";
            }
            xml += "</dosages>";
            xml += "<period><startDate>" + prescriptionLine.startDate + "</startDate><endDate>" + prescriptionLine.endDate + "</endDate></period>";
        }
        xml += "<status>" + prescriptionLine.status + "</status>";
        xml += prescriptionLine.group ? "<group><groupId>" + prescriptionLine.group.groupId + "</groupId>" + "<groupType>" + prescriptionLine.group.groupType + "</groupType></group>" : '';
        xml += prescriptionLine.aldStatus ? "<aldStatus><ald>" + (prescriptionLine.aldStatus.ald == 1).toString() + "</ald>" + "<aldCode>" + prescriptionLine.aldStatus.aldCode + "</aldCode></aldStatus>" : '';
        return xml + "</prescription-line>";
    }
    getBasicPatientXml(patient) {
        var xml = "";
        if (patient) {
            var dateOfBirth = patient.dateOfBirth;
            if (typeof dateOfBirth == "string") {
                dateOfBirth = patient.dateOfBirth ? patient.dateOfBirth.replace(" ", "T") : "";
            }
            else {
                dateOfBirth = patient.dateOfBirth ? patient.dateOfBirth.toISOString().replace(" ", "T").substring(0, 19) : "";
            }
            xml += patient.dateOfBirth ? ("<dateOfBirth>" + dateOfBirth + "</dateOfBirth>") : "";
            xml += "<gender>" + patient.gender + "</gender>";
            xml += "<weight>" + patient.weight + "</weight>";
            xml += "<height>" + patient.height + "</height>";
            xml += patient.breastFeeding && patient.breastFeeding != "" && patient.breastFeeding != "-1" ? "<breastFeeding>" + patient.breastFeeding + "</breastFeeding>" : "";
            xml += patient.weeksOfAmenorrhea && patient.weeksOfAmenorrhea != "" && patient.weeksOfAmenorrhea != "-1" ? "<weeksOfAmenorrhea>" + patient.weeksOfAmenorrhea + "</weeksOfAmenorrhea>" : "";
            xml += patient.creatin && patient.creatin != "" && patient.creatin != null && patient.creatin != "-1" ? "<creatin>" + patient.creatin + "</creatin>" : "";
            xml += patient.hepaticInsufficiency && patient.hepaticInsufficiency != "" ? "<hepaticInsufficiency>" + patient.hepaticInsufficiency + "</hepaticInsufficiency>" : "";
        }
        return xml;
    }
    getPatientXml(patient) {
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
    }
    getPrescriptionXml(prescription) {
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
    }
    getAlerts(callback, prescription, params, type) {
        params.url = this.getApiBaseUrl() + this.getApiDomain() +
            (type == "html" ? this.configuration.alertsHtml : this.configuration.alertsFull) + this.getUrlCredentials("?");
        params.body = this.getPrescriptionXml(prescription);
        if (prescription && prescription.lines) {
            this.toolbox.log(params.body);
            if (prescription.lines.length > 0) {
                this.rest.call((data, error) => callback(data, error), "POST", params.url, params.body, this.contentType, true);
            }
            else {
                callback(null, "No line in the prescription or no prescription");
            }
        }
        else {
            callback(null, "No line in the prescription or no prescription");
        }
    }
    getAlertColor(severity) {
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
    }
    getRelevantAlerts(alert) {
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
    }
    assignAlertsToLines(prescription, xmlAlerts) {
        if (prescription) {
            for (var i = 0; i < prescription.lines.length; i++) {
                var line = prescription.lines[i];
                line.alertSummary = [];
                if (xmlAlerts && xmlAlerts.feed && xmlAlerts.feed.entry) {
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
        }
    }
    addStyleToHtml(text, hideSidebar, hideHeader) {
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
    }
    ;
    getOptDocument(callback, type, id) {
        if (type && id) {
            var url = this.getApiBaseUrl() + this.getApiDomain() + "/" + type + "/" + id + "/documents/opt" + this.getUrlCredentials("?");
            this.rest.call((data, error) => callback(data, error), "GET", url, null, this.contentType);
        }
    }
    getDocuments(callback, type, id, params) {
        if (type && id) {
            params.url = this.getApiBaseUrl() + this.getApiDomain() + "/" + type + "/" + id + "/documents" + this.getUrlCredentials("?");
            this.rest.call((data, error) => callback(data, error), "GET", params.url, null, this.contentType);
        }
    }
    getATCClassFromProduct(callback, type, id) {
        if (type && id) {
            var url = this.getApiBaseUrl() + this.getApiDomain() + "/" + type + "/" + id + "/atc-classification" + this.getUrlCredentials("?");
            this.rest.call((data, error) => callback(data, error), "GET", url, null, this.contentType);
        }
    }
    getVIDALClassFromProduct(callback, type, id) {
        if (type && id) {
            var url = this.getApiBaseUrl() + this.getApiDomain() + "/" + type + "/" + id + "/vidal-classification" + this.getUrlCredentials("?");
            this.rest.call((data, error) => callback(data, error), "GET", url, null, this.contentType);
        }
    }
    getInteractionClassFromProduct(callback, type, id) {
        if (type && id && type == "PRODUCT") {
            var soap = require('soap');
            var args = { "productId": id };
            soap.createClient(this.configuration.drugInteractionClassWsdl, function (err, client) {
                client.searchByProductId(args, function (err, result) {
                    if (callback) {
                        callback(result, null);
                    }
                });
            });
        }
    }
    getProduct(callback, type, id) {
        if (type && id) {
            var url = this.getApiBaseUrl() + this.getApiDomain() + "/" + type + "/" + id + this.getUrlCredentials("?");
            this.rest.call((data, error) => callback(data, error), "GET", url, null, this.contentType);
        }
    }
    getVigieAlerts(callback, prescription) {
        if (prescription && prescription.patient && prescription.patient.dateOfBirth) {
            //var arr = prescription.patient.dateOfBirth.split("-");
            var today = new Date();
            var dob = prescription.patient.dateOfBirth;
            if (typeof dob == "string") {
                dob = new Date(dob);
            }
            var ageYears = today.getFullYear() - dob.getFullYear();
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
            this.rest.call((data, error) => callback(data, error), "POST", url, JSON.stringify(body), "application/json");
        }
    }
    getNewsFromProduct(callback, type, id) {
        if (type && id && (type == "product" || type == "package")) {
            var url = this.getApiBaseUrl() + this.configuration.newsDomain + "/" + type + "/" + id + this.getUrlCredentials("?");
            this.rest.call((data, error) => callback(data, error), "GET", url, null, this.contentType);
        }
    }
    getPosologyXml(patient, routeIds, indicationIds) {
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
    }
    getPosologyFromProduct(callback, type, id, patient, routeIds, indicationIds, params) {
        if (type && id && patient) {
            params.url = this.getApiBaseUrl() + this.getApiDomain() + "/" + type + "/" + id + "/posology-descriptors" + this.getUrlCredentials("?");
            params.body = this.getPosologyXml(patient, routeIds, indicationIds);
            this.rest.call((data, error) => callback(data, error), "POST", params.url, params.body, this.contentType);
        }
    }
    getUnitIdFromFrequency(stringFrequency) {
        var fil = this.frequencyToUnitId.filter((row) => row.key == stringFrequency);
        return fil[0].value;
    }
    getFrequencyFromUnitId(unitId) {
        if (unitId) {
            var fil = this.frequencyToUnitId.filter((row) => row.value == unitId);
            return fil[0].key;
        }
        else {
            return "";
        }
    }
    getPostComplementXml(drugs, icd10Codes, text, removeAlreadyCoded, drugCoefficient, textCoefficient) {
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
        ret += "<engine>VIDAL</engine><drugCursor>DEFAULT</drugCursor>";
        if (removeAlreadyCoded) {
            ret += "<removeAlreadyCoded>true</removeAlreadyCoded>";
        }
        if (textCoefficient) {
            ret += "<textCoefficient>" + textCoefficient + "</textCoefficient>";
        }
        if (drugCoefficient) {
            ret += "<drugCoefficient>" + drugCoefficient + "</drugCoefficient>";
        }
        ret += "</request>";
        return ret;
    }
    getPostComplement(callback, drugs, icd10Codes, text, params, removeAlreadyCoded, drugCoefficient, textCoefficient) {
        if ((drugs && drugs.length > 0) || (text && text.length > 0)) {
            params.url = this.getApiBaseUrl() + this.configuration.pmsiDomain + this.configuration.postComplement + this.getUrlCredentials("?");
            params.body = this.getPostComplementXml(drugs, icd10Codes, text, removeAlreadyCoded, drugCoefficient, textCoefficient);
            this.rest.call((data, error) => callback(data, error), "POST", params.url, params.body, this.contentType, true);
        }
    }
    getPostControl(callback, drugs, icd10Codes, text, params) {
        if ((drugs && drugs.length > 0) || (text && text.length > 0)) {
            params.url = this.getApiBaseUrl() + this.configuration.pmsiDomain + this.configuration.postControl + this.getUrlCredentials("?");
            params.body = this.getPostComplementXml(drugs, icd10Codes, text, null, null, null);
            this.rest.call((data, error) => callback(data, error), "POST", params.url, params.body, this.contentType, true);
        }
    }
    getCim10FromIndicationGroupId(callback, id) {
        if (id) {
            var url = this.getApiBaseUrl() + this.getApiDomain() + this.configuration.indicationGroup + "/" + id + "/cim10s" + this.getUrlCredentials("?");
            this.rest.call((data, error) => callback(data, error), "GET", url, null, this.contentType, true);
        }
    }
    getRecosFromIndicationGroupId(callback, id) {
        if (id) {
            var url = this.getApiBaseUrl() + this.getApiDomain() + this.configuration.indicationGroup + "/" + id + "/recos" + this.getUrlCredentials("?");
            this.rest.call((data, error) => callback(data, error), "GET", url, null, this.contentType, true);
        }
    }
    getPrescriptionRecos(callback, prescription, params) {
        params.body = this.getPrescriptionXml(prescription);
        params.url = this.getApiBaseUrl() + this.getApiDomain() + this.configuration.prescriptionRecos + this.getUrlCredentials("?");
        this.toolbox.log(prescription.xmlBody);
        this.rest.call((data, error) => callback(data, error), "POST", params.url, params.body, this.contentType, true);
    }
    getRecoUrl(id) {
        return this.getApiBaseUrl() + this.getApiDomain() + this.configuration.reco + "/" + id + "/html" + this.getUrlCredentials("?");
    }
    getReco(callback, id) {
        this.rest.call((data, error) => callback(data, error), "GET", this.getRecoUrl(id), null, this.contentType, true);
    }
    getAdaptedDugsXml(vmpId, facets, page, pageSize) {
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
    }
    getAdaptedDrugs(callback, vmpId, facets, page, pageSize, params) {
        if (vmpId) {
            params.body = this.getAdaptedDugsXml(vmpId, facets, page, pageSize);
            params.url = this.getApiBaseUrl() + this.getApiDomain() + this.configuration.adaptedDrugs + this.getUrlCredentials("?");
            this.toolbox.log(params.xmlBody);
            this.rest.call((data, error) => callback(data, error), "POST", params.url, params.body, this.contentType, true);
        }
    }
    getSideEffectsXml(drugs, sideEffectId) {
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
    }
    getSideEffects(callback, drugs, sideEffectId, params) {
        if (sideEffectId) {
            params.body = this.getSideEffectsXml(drugs, sideEffectId);
            params.url = this.getApiBaseUrl() + this.getApiDomain() + this.configuration.sideEffectSort + this.getUrlCredentials("?");
            this.toolbox.log(params.xmlBody);
            this.rest.call((data, error) => callback(data, error), "POST", params.url, params.body, this.contentType, true);
        }
    }
    getVigieHtml(data, title) {
        if (data.json && data.json.feed && data.json.feed.entry) {
            var html = "";
            for (var i = 0; i < data.json.feed.entry.length; i++) {
                var entry = data.json.feed.entry[i];
                //html += "<h4>" + entry.title + "</h4>";
                html += entry.summary;
            }
            return "<div class='notificationVigie'><h1>" + title + "</h1>" + html + "</div>";
        }
    }
    getVersion(callback, params, credentials = null) {
        params.url = this.getApiBaseUrl() + this.getApiDomain() + this.configuration.version + (credentials ? "?" + credentials : this.getUrlCredentials("?"));
        this.rest.call((data, error) => callback(data, error), "GET", params.url, null, this.contentType, true);
    }
    /*
        flattenObject(object: any){
            if (object.isArray()){
                if (object.length == 1){
                    if (typeof object[0] != "object"){
                        return object[0];
                    }else{
                        if (object[0]["_"]){
                            return object[0]["_"];
                        }
                    }
                }
            }
            if (object["_"] != "object"){
                return object["_"];
            }
            return object;
        }
    */
    refactorAlerts(alerts, idPrescription) {
        var ret = [];
        if (alerts) {
            for (var i = 0; i < alerts.length; i++) {
                let entr = alerts[i];
                if (entr.link && entr["vidal:categories"] && entr["vidal:categories"][0] == "PRESCRIPTION_LINE") {
                    for (var j = 0; j < entr.link.length; j++) {
                        if (entr.link[j].rel[0] == "inline") {
                            let href = entr.link[j].href[0];
                            let elem = this.toolbox.sES(alerts, "id", href);
                            if (elem) {
                                let al = {
                                    "id": "",
                                    "prescriptionId": idPrescription,
                                    "type": this.toolbox.gVS(elem, "vidal:alertType", "name"),
                                    "severity": this.toolbox.gVS(elem, "vidal:severity"),
                                    "detail": this.toolbox.gVS(elem, "vidal:alertType", "_"),
                                    "content": this.toolbox.gVS(elem, "_"),
                                    "drugId": this.toolbox.gVS(entr, "vidal:drugId"),
                                    "drugName": this.toolbox.gVS(entr, "title"),
                                    "drugType": this.toolbox.gVS(entr, "vidal:type")
                                };
                                al.id = this.toolbox.gVS(elem, "id").replace("vidal://", "").replace(new RegExp("/", 'g'), "_");
                                ret.push(al);
                            }
                        }
                    }
                }
            }
        }
        return ret;
    }
    checkCredentials(callback, app_id, app_key) {
        let url = this.getApiBaseUrl() + this.getApiDomain() + this.configuration.version + this.getUrlCredentials("?", app_id, app_key);
        this.rest.call((data, error) => callback(data, error), "GET", url);
    }
}
exports.Vidal = Vidal;
