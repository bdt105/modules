# Vidal #
This package gives functions to use main vidal APIs

## Dependencies ##
- bdt105toolbox

## How to install? ##
~~~
npm install --save bdt105vidal
~~~

## How to use? ##
Create an object Vidal 
~~~
import { Vidal } from "bdt105vidal/dist";
~~~

## Configuration ##
Overide configuration object properties if needed.

~~~
public configuration = {
    "baseUrl": "http://api.vidal.fr",
    "urlVigie": "http://dev-vidal-memo.vidal.fr/api/memo-rules/rules",
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
    "alertsHtmlStyleHideHeader": "body {margin-top: 10px}",
};

~~~
## Functions ##
~~~
cleanId(id: any, type: string): string;
getApiBaseUrl(): string;
getHtmlStyle(): boolean;
getApp_key(): string;
getApp_id(): string;
getUrlCredentials(prefix: string): string;
search(callback: Function, params: string): void;
searchAllergies(callback: Function, params: string): void;
getProducts(params: string, filter: string): void;
getAllergies(params: string): void;
getPathologies(params: string): void;
searchPathologies(callback: Function, params: string): void;
getFromId(callback: Function, type: string, id: string): void;
getPrescriptionUnits(callback: Function, type: string, id: string): void;
getPrescriptionRoutes(callback: Function, type: string, id: string): void;
getIndications(callback: Function, type: string, id: string): void;
getAlerts(callback: Function, prescription: any, params: any, type: string): void;
assignAlertsToLines(prescription: any, xmlAlerts: any): void;
addStyleToHtml(text: string, hideSidebar: boolean, hideHeader: boolean): string;
getOptDocument(callback: Function, type: string, id: number): void;
getDocuments(callback: Function, type: string, id: number, params: any): void;
getATCClassFromProduct(callback: Function, type: string, id: number): void;
getVIDALClassFromProduct(callback: Function, type: string, id: number): void;
getProduct(callback: Function, type: string, id: number): void;
getVigieAlerts(callback: Function, prescription: any): void;
getNewsFromProduct(callback: Function, type: string, id: number): void;
private getPosologyXml(patient, routeIds, indicationIds);
getPosologyFromProduct(callback: Function, type: string, id: number, patient: any, routeIds: number[], indicationIds: number[], params: any): void;
getUnitIdFromFrequency(stringFrequency: string): number;
getFrequencyFromUnitId(unitId: Number): string;
private getPostComplementXml(drugs, icd10Codes, text);
getPostComplement(callback: Function, drugs: string[], icd10Codes: string[], text: string, params: any): void;
getCim10FromIndicationGroupId(callback: Function, id: number): void;
getRecosFromIndicationGroupId(callback: Function, id: number): void;
getPrescriptionRecos(callback: Function, prescription: any, params: any): void;
getRecoUrl(id: number): string;
getReco(callback: Function, id: number): void;
private getAdaptedDugsXml(vmpId, facets, page, pageSize);
getAdaptedDrugs(callback: Function, vmpId: number, facets: any[], page: number, pageSize: number, params: any): void;
private getSideEffectsXml(drugs, sideEffectId);
getSideEffects(callback: Function, drugs: string[], sideEffectId: number, params: any): void;
getVigieHtml(data: any, title: string): string;
getVersion(callback: Function, params: any, credentials?: any): void;
flattenObject(object: any): any;
~~~