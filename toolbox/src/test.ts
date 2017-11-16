import { Toolbox, Rest } from './index';

var t = new Toolbox();

var s = t.beautifyJson('{"a1": "0", "a2": "2"}');
console.log(s);

var xml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<prescription>
    <patient>
        <dateOfBirth>1980-10-26T01:01:01</dateOfBirth>
        <gender>MALE</gender>
        <!-- MALE FEMALE NONE -->
        <weight>80</weight>
        <!-- kg -->
        <height>180</height>
        <!-- cm -->
        <breastFeeding>NONE</breastFeeding>
        <!-- NONE LESS_THAN_ONE_MONTH MORE_THAN_ONE_MONTH ALL (if no information available) -->
        <creatin>80</creatin>
        <!-- ml/min -->
        <hepaticInsufficiency>NONE</hepaticInsufficiency>
        <!-- NONE MODERATE SEVERE -->
        <weeksOfAmenorrhea>1</weeksOfAmenorrhea>
        <allergies>
            <!-- use /rest/api/allergies?q=xxx -->
            <allergy>vidal://allergy/635</allergy>
        </allergies>
        <molecules>
            <!-- use /rest/api/allergies?q=xxx -->
            <molecule>vidal://molecule/309</molecule>
        </molecules>
        <pathologies>
            <!-- /rest/api/pathologies?q=xxx&type=CIM10 -->
            <pathology>vidal://cim10/4398</pathology>
            <!-- vidal://cim10/idXXX -->
            <pathology>vidal://cim10/code/J45</pathology>
            <!-- vidal://cim10/code/XXX -->
        </pathologies>
    </patient>
    <prescription-lines>
        <prescription-line>
            <drugId>12759</drugId>
            <drugType>COMMON_NAME_GROUP</drugType>
            <!--COMMON_NAME_GROUP PRODUCT PACK UCD -->
            <dose>2.000</dose>
            <unitId>129</unitId>
            <duration>3</duration>
            <durationType>DAY</durationType>
            <!-- MINUTE HOUR DAY WEEK MONTH YEAR -->
            <frequencyType>PER_DAY</frequencyType>
            <!-- THIS_DAY PER_DAY PER_24_HOURS PER_WEEK PER_MONTH PER_YEAR PER_2_DAYS PER_HOUR PER_MINUTE -->
        </prescription-line>
        <prescription-line>
            <drug>vidal://package/41929</drug>
            <!-- vidal://package/idXXXX vidal://product/idXXX vidal://vmp/idXXX vidal://ucd/idXXX-->
            <dose>2.000</dose>
            <unitId>35</unitId>
            <duration>2</duration>
            <durationType>DAY</durationType>
            <frequencyType>PER_DAY</frequencyType>
            <routes>
                <!-- use /rest/api/routes?q=xxx -->
                <route>vidal://route/38</route>
                <route>vidal://route/14</route>
            </routes>
        </prescription-line>
        <prescription-line>
            <drugId>1037</drugId>
            <drugType>PRODUCT</drugType>
            <dose>2</dose>
            <unitId>129</unitId>
            <duration>5</duration>
            <durationType>DAY</durationType>
            <frequencyType>PER_DAY</frequencyType>
            <routes>
                <route>vidal://route/38</route>
            </routes>
        </prescription-line>
        <prescription-line>
            <drug>vidal://ucd/ucd13/3400892676739</drug>
            <!-- vidal://cip7/XXXX vidal://cip13/XXX vidal://ucd13/XXX vidal://cis/XXX -->
            <dose>2</dose>
            <unitId>129</unitId>
            <duration>5</duration>
            <durationType>DAY</durationType>
            <frequencyType>PER_DAY</frequencyType>
            <routes>
                <route>vidal://route/38</route>
            </routes>
        </prescription-line>
    </prescription-lines>
</prescription>`;

let callback = function(json: any){
    console.log(JSON.stringify(json));
}

// var ret = t.xml2json(xml, callback);

// t.log(ret, 'log.txt');

var r = new Rest();

r.call(data => callback(data), "GET", "http://api.vidal.fr/rest/api/version", null, "text/xml");

var tes = JSON.parse(`[
    {
        "idprescribable": 32815,
        "prescribableId": 5,
        "code": "0000000000005",
        "name": "Lactitol [IMPORTAL] BUV",
        "hasKnownEffectExcipients": 1,
        "isHomogeneousOnIndications": 0,
        "hasSafetyAlert": 1,
        "hasMultipleRoutes": 1,
        "longName": "[IMPORTAL] LACTITOL ; TOUTES VOIES ; TOUTES FORMES ; TOUS DOSAGES",
        "lastModificationTime": "0000-00-00 00:00:00",
        "startDate": "2015-09-21T22:00:00.000Z",
        "endDate": "0000-00-00 00:00:00",
        "marketStatus": 0,
        "idprescribableline": 1,
        "iddrug": 3140,
        "drugtype": "ucd",
        "drugname": "IMPORTAL 10G BUV PDR SACH",
        "startdate": "2011-10-19T22:00:00.000Z",
        "enddate": null,
        "data": null
    },
    {
        "idprescribable": 32815,
        "prescribableId": 5,
        "code": "0000000000005",
        "name": "Lactitol [IMPORTAL] BUV",
        "hasKnownEffectExcipients": 1,
        "isHomogeneousOnIndications": 0,
        "hasSafetyAlert": 1,
        "hasMultipleRoutes": 1,
        "longName": "[IMPORTAL] LACTITOL ; TOUTES VOIES ; TOUTES FORMES ; TOUS DOSAGES",
        "lastModificationTime": "0000-00-00 00:00:00",
        "startDate": "2015-09-21T22:00:00.000Z",
        "endDate": "0000-00-00 00:00:00",
        "marketStatus": 0,
        "idprescribableline": 2,
        "iddrug": 4039,
        "drugtype": "ucd",
        "drugname": "IMPORTAL 5G BUV PDR SACH",
        "startdate": "2011-10-19T22:00:00.000Z",
        "enddate": null,
        "data": null
    },
    {
        "idprescribable": 32815,
        "prescribableId": 5,
        "code": "0000000000005",
        "name": "Lactitol [IMPORTAL] BUV",
        "hasKnownEffectExcipients": 1,
        "isHomogeneousOnIndications": 0,
        "hasSafetyAlert": 1,
        "hasMultipleRoutes": 1,
        "longName": "[IMPORTAL] LACTITOL ; TOUTES VOIES ; TOUTES FORMES ; TOUS DOSAGES",
        "lastModificationTime": "0000-00-00 00:00:00",
        "startDate": "2015-09-21T22:00:00.000Z",
        "endDate": "0000-00-00 00:00:00",
        "marketStatus": 0,
        "idprescribableline": 3,
        "iddrug": 4040,
        "drugtype": "ucd",
        "drugname": "IMPORTAL 2,5G BUV PDR SACH",
        "startdate": "2011-10-19T22:00:00.000Z",
        "enddate": null,
        "data": null
    },
    {
        "idprescribable": 32833,
        "prescribableId": 27,
        "code": "0000000000027",
        "name": "Tipranavir [APTIVUS] BUV",
        "hasKnownEffectExcipients": 1,
        "isHomogeneousOnIndications": 1,
        "hasSafetyAlert": 1,
        "hasMultipleRoutes": 0,
        "longName": "[APTIVUS] TIPRANAVIR ; ORALE ; SOL BUV ;  TOUS DOSAGES",
        "lastModificationTime": "0000-00-00 00:00:00",
        "startDate": "2013-10-21T22:00:00.000Z",
        "endDate": "0000-00-00 00:00:00",
        "marketStatus": 0,
        "idprescribableline": 4,
        "iddrug": 15820,
        "drugtype": "ucd",
        "drugname": "APTIVUS 100MG/ML BUV FL95ML",
        "startdate": "2011-10-19T22:00:00.000Z",
        "enddate": null,
        "data": null
    },
    {
        "idprescribable": 32850,
        "prescribableId": 47,
        "code": "0000000000047",
        "name": "Amoxicilline 100mg/ml [AMODEX] BUV",
        "hasKnownEffectExcipients": 1,
        "isHomogeneousOnIndications": 1,
        "hasSafetyAlert": 1,
        "hasMultipleRoutes": 0,
        "longName": "[AMODEX] AMOXICILLINE * 500 MG/5 ML ; VOIE ORALE ; PDRE P SUSP BUV",
        "lastModificationTime": "0000-00-00 00:00:00",
        "startDate": "2014-06-18T22:00:00.000Z",
        "endDate": "0000-00-00 00:00:00",
        "marketStatus": 0,
        "idprescribableline": 5,
        "iddrug": 2122,
        "drugtype": "ucd",
        "drugname": "AMODEX 500MG BUV PDR FL60ML",
        "startdate": "2011-10-19T22:00:00.000Z",
        "enddate": null,
        "data": null
    }
]
`);

console.log(t.factorizeMasterSlave(tes, "idprescribable", "idprescribableline", "lines"));