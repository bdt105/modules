"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var index_1 = require("./index");
var needle = require('needle');
/*
const body = {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZHVzZXIiOjIzLCJsb2dpbiI6ImRhdGFkcml2ZSIsInBhc3N3b3JkIjoiJDJhJDEwJFZuL3pQQ004c1NTYVluUm1nZ1Y0Q09MbzJ0WVROdUgzUUNaNG9jMzNwMnBxbC9lQUNpd09lIiwiZW1haWwiOiJkYXRhZHJpdmVAc29sYXJkYXRhLnRlY2giLCJ0eXBlIjoxMDAsImNvdW50cnkiOiJGUiIsImxhc3RuYW1lIjoiZGF0YWRyaXZlIiwiZmlyc3RuYW1lIjoiZGF0YWRyaXZlIiwicGhvbmUxIjpudWxsLCJwaG9uZTIiOm51bGwsInBob25lMyI6bnVsbCwidGFnIjpudWxsLCJhdmFpbGFiaWxpdHkiOm51bGwsImxhbmd1YWdlIjpudWxsLCJvZmZpY2UiOm51bGwsInBvc3RhbGNvZGUiOm51bGwsImNpdHkiOm51bGwsImFkZHJlc3MxIjpudWxsLCJhZGRyZXNzMiI6bnVsbCwiYXBwbGljYXRpb24iOiJkYXRhZHJpdmUiLCJ2YWxpZGF0ZWQiOjEsIm9yZ2FuaXNhdGlvbiI6bnVsbCwiY3JlYXRpb25kYXRlIjoiMjAxOS0xMC0zMFQxODozNjowNC4wMDBaIiwidXBkYXRlZGF0ZSI6IjIwMTktMTAtMzBUMTg6MzY6MDQuMDAwWiIsInZhbGlkYXRpb25Db2RlIjpudWxsLCJ2YWxpZGF0aW9uRGF0ZSI6bnVsbCwiaWF0IjoxNTcyNTEzMjA4fQ.KJ1RZ4yHQp5dSk9CpL88l0c1xLJnlupPolTpCfus08g",
    "identifier": "budensmsivirtual"
};
*/
var body = null;
var PDVs = [{ 'pdv': '5907', 'city': 'MALVEIRA' },
    { 'pdv': '3208', 'city': 'LAGOS' },
    { 'pdv': '7960', 'city': 'ERICEIRA' },
    { 'pdv': '76114', 'city': 'MAFRA' },
    { 'pdv': '1615', 'city': 'POMBAL' },
    { 'pdv': '2357', 'city': 'LAGOA' },
    { 'pdv': '5460', 'city': 'VILA REAL' },
    { 'pdv': '2797', 'city': 'PONTE DE LIMA' },
    { 'pdv': '1006', 'city': 'MARINHA GRANDE     ' },
    { 'pdv': '76102', 'city': 'CANTANHEDE' },
    { 'pdv': '7348', 'city': 'FAMÕES-ODIVELAS' },
    { 'pdv': '6725', 'city': 'ALJEZUR' },
    { 'pdv': '1543', 'city': 'POVOA DE LANHOSO  ' },
    { 'pdv': '3265', 'city': 'BEJA' },
    { 'pdv': '2057', 'city': 'LEIRIA ' },
    { 'pdv': '5934', 'city': 'SÃO TEOTÓNIO ' },
    { 'pdv': '3622', 'city': 'ABRANTES' },
    { 'pdv': '9478', 'city': 'MEALHADA' },
    { 'pdv': '4599', 'city': 'AMARES' },
    { 'pdv': '8058', 'city': 'TOMAR                                     ' },
    { 'pdv': '7082', 'city': 'CONDEIXA A NOVA' },
    { 'pdv': '9612', 'city': 'COIMBRA - TAVEIRO' },
    { 'pdv': '1620', 'city': 'CARTAXO' },
    { 'pdv': '6072', 'city': 'ARCOS DE VALDEVEZ' },
    { 'pdv': '1008', 'city': 'TORRES VEDRAS' },
    { 'pdv': '5047', 'city': 'S. DOMINGOS DE RANA' },
    { 'pdv': '1282', 'city': 'CORUCHE ' },
    { 'pdv': '8994', 'city': 'ALCANENA             ' },
    { 'pdv': '5032', 'city': 'PINHAL NOVO' },
    { 'pdv': '6876', 'city': 'ALMADA (CAPARICA)' },
    { 'pdv': '4875', 'city': 'MONT. O NOVO' },
    { 'pdv': '9461', 'city': 'FERNÃO FERRO' },
    { 'pdv': '76110', 'city': 'OUREM' },
    { 'pdv': '5933', 'city': 'FERREIRAS ' },
    { 'pdv': '6841', 'city': 'TORRE DA MEDRONHEIRA' },
    { 'pdv': '1540', 'city': 'CALDAS DAS TAIPAS' },
    { 'pdv': '9064', 'city': 'MARINHA DA GUIA' },
    { 'pdv': '2486', 'city': 'TORRES NOVAS' },
    { 'pdv': '5372', 'city': 'MELGAÇO' },
    { 'pdv': '2029', 'city': 'FIGUEIRA DA FOZ' },
    { 'pdv': '5287', 'city': 'ÉVORA II' },
    { 'pdv': '7851', 'city': 'SÃO BARTOLOMEU MESSINES ' },
    { 'pdv': '6427', 'city': 'GUIMARÃES ' },
    { 'pdv': '5916', 'city': 'LAGOA (Alporchinhos)' },
    { 'pdv': '76127', 'city': 'LOURINHA' },
    { 'pdv': '9099', 'city': 'VIANA DO CASTELO' },
    { 'pdv': '8186', 'city': 'CADAVAL' },
    { 'pdv': '8578', 'city': 'VILA PRAIA D\'ÂNCORA' },
    { 'pdv': '9063', 'city': 'ESTARREJA ' },
    { 'pdv': '6180', 'city': 'CANEDO' },
    { 'pdv': '7850', 'city': 'ELVAS' },
    { 'pdv': '4452', 'city': 'SILVEIRA' },
    { 'pdv': '4482', 'city': 'ESTREMOZ ' },
    { 'pdv': '4465', 'city': 'V.N. FÓZ CÔA' },
    { 'pdv': '1561', 'city': 'GUARDA                   ' },
    { 'pdv': '76126', 'city': 'FAFE' },
    { 'pdv': '5038', 'city': 'GANDARA' },
    { 'pdv': '76137', 'city': 'BENAVENTE' },
    { 'pdv': '7989', 'city': 'SACAVÉM' },
    { 'pdv': '7839', 'city': 'SINES ' },
    { 'pdv': '5724', 'city': 'ALIJÓ' },
    { 'pdv': '6347', 'city': 'A - DOS-CUNHADOS' },
    { 'pdv': '6729', 'city': 'CARREGADO' },
    { 'pdv': '6571', 'city': 'AREOSA' },
    { 'pdv': '3209', 'city': 'BUDENS' },
    { 'pdv': '6367', 'city': 'CASTELO DE PAIVA' },
    { 'pdv': '7541', 'city': 'MOGADOURO' },
    { 'pdv': '6224', 'city': 'ÉVORA I' },
    { 'pdv': '6171', 'city': 'VISEU' },
    { 'pdv': '5940', 'city': 'REGUENGOS             ' },
    { 'pdv': '7849', 'city': 'ALCÁCER DO SAL' },
    { 'pdv': '1210', 'city': 'MARCO DE CANAVESES' },
    { 'pdv': '7380', 'city': 'MOITA' },
    { 'pdv': '6594', 'city': 'FERREIRA ALENTEJO' },
    { 'pdv': '4056', 'city': 'COVILHÃ' },
    { 'pdv': '8589', 'city': 'ESMORIZ' },
    { 'pdv': '1425', 'city': 'AMARANTE' },
    { 'pdv': '8070', 'city': 'NISA' },
    { 'pdv': '3024', 'city': 'MIRA' },
    { 'pdv': '6004', 'city': 'PAREDES' },
    { 'pdv': '4634', 'city': 'BRAGA' },
    { 'pdv': '6196', 'city': 'MIRANDELA' },
    { 'pdv': '3498', 'city': 'NELAS' },
    { 'pdv': '7840', 'city': 'SANTO ANDRÉ' },
    { 'pdv': '8184', 'city': 'SÃO JOÃO DOS MONTES' },
    { 'pdv': '3519', 'city': 'MACEIRA' },
    { 'pdv': '4280', 'city': 'IDANHA A NOVA' },
    { 'pdv': '1708', 'city': 'VALPAÇOS' },
    { 'pdv': '7615', 'city': 'ARRUDA DOS VINHOS  ' },
    { 'pdv': '5866', 'city': 'CASTRO D\'AIRE' },
    { 'pdv': '76120', 'city': 'MONT O VELHO' },
    { 'pdv': '8274', 'city': 'PORTIMÃO' },
    { 'pdv': '7421', 'city': 'CACEM                                ' },
    { 'pdv': '6797', 'city': 'CARVALHOS   ' },
    { 'pdv': '8047', 'city': 'CASTRO VERDE II' },
    { 'pdv': '2059', 'city': 'MARINHAIS' },
    { 'pdv': '5423', 'city': 'MORTÁGUA' },
    { 'pdv': '7581', 'city': 'ALCOBAÇA' },
    { 'pdv': '76112', 'city': 'PENAFIEL' },
    { 'pdv': '7880', 'city': 'GAFANHA DA NAZARÉ' },
    { 'pdv': '7550', 'city': 'VILA NOVA DA BARQUINHA' },
    { 'pdv': '8174', 'city': 'SATÃO ' },
    { 'pdv': '5884', 'city': 'ALFENA ' },
    { 'pdv': '8048', 'city': 'PRADO' },
    { 'pdv': '6464', 'city': 'SAGRES' },
    { 'pdv': '6271', 'city': 'PATAIAS' },
    { 'pdv': '3985', 'city': 'VILA REAL STº ANTÓNIO' },
    { 'pdv': '7397', 'city': 'BOMBARRAL' },
    { 'pdv': '6985', 'city': 'MONTIJO' },
    { 'pdv': '6848', 'city': 'VOLTA DA PEDRA' },
    { 'pdv': '6381', 'city': 'VILA DAS AVES' },
    { 'pdv': '5040', 'city': 'SABUGAL' },
    { 'pdv': '7325', 'city': 'AGUEDA             ' },
    { 'pdv': '6858', 'city': 'MONCHIQUE' },
    { 'pdv': '7365', 'city': 'OLHÃO' },
    { 'pdv': '7920', 'city': 'TONDELA' },
    { 'pdv': '7573', 'city': 'VIALONGA' },
    { 'pdv': '9486', 'city': 'ARCOZELO' },
    { 'pdv': '5440', 'city': 'PROENÇA-A-NOVA  ' },
    { 'pdv': '76131', 'city': 'PENICHE' },
    { 'pdv': '3507', 'city': 'RIO MAIOR' },
    { 'pdv': '3420', 'city': 'AZAMBUJA' },
    { 'pdv': '7096', 'city': 'SETUBAL' },
    { 'pdv': '8163', 'city': 'AZEITÃO' },
    { 'pdv': '5346', 'city': 'GOUVEIA' },
    { 'pdv': '4683', 'city': 'VIEIRA DE LEIRIA' },
    { 'pdv': '3986', 'city': 'ALTURA' },
    { 'pdv': '8202', 'city': 'MOURA                     ' },
    { 'pdv': '4949', 'city': 'MAÇÃO' },
    { 'pdv': '6375', 'city': 'PORTO DE MÓS ' },
    { 'pdv': '7901', 'city': 'STA IRIA AZOIA' },
    { 'pdv': '1745', 'city': 'BELMONTE' },
    { 'pdv': '9053', 'city': 'FUNDÃO' },
    { 'pdv': '8225', 'city': 'CASTELO BRANCO ' },
    { 'pdv': '7344', 'city': 'MONTALEGRE' },
    { 'pdv': '7486', 'city': 'ODEMIRA' },
    { 'pdv': '6286', 'city': 'FIGUEIRÓ DOS VINHOS' },
    { 'pdv': '1315', 'city': 'PAREDES COURA' },
    { 'pdv': '2872', 'city': 'SEIA' },
    { 'pdv': '1314', 'city': 'TÁBUA' },
    { 'pdv': '8342', 'city': 'ALCAINS' },
    { 'pdv': '5943', 'city': 'JOVIM' },
    { 'pdv': '5374', 'city': 'BRAGANÇA ' },
    { 'pdv': '7591', 'city': 'ALVOR ' },
    { 'pdv': '6379', 'city': 'S. MARTINHO DO PORTO' },
    { 'pdv': '8738', 'city': 'VALENÇA ' },
    { 'pdv': '7916', 'city': 'COIMBRA - MESURA' },
    { 'pdv': '5773', 'city': 'AVEIRAS DE CIMA' },
    { 'pdv': '6642', 'city': 'FAJÕES' },
    { 'pdv': '2573', 'city': 'OLIVEIRA DO BAIRRO' },
    { 'pdv': '2713', 'city': 'VILAR FORMOSO' },
    { 'pdv': '6726', 'city': 'VILA VIÇOSA' },
    { 'pdv': '3836', 'city': 'FERREIRA ZEZERE' },
    { 'pdv': '7833', 'city': 'GOLEGÃ' },
    { 'pdv': '6859', 'city': 'SANTA EULÁLIA - ALBUFEIRA' },
    { 'pdv': '3012', 'city': 'ABRIGADA' },
    { 'pdv': '9613', 'city': 'CINFÃES' },
    { 'pdv': '8219', 'city': 'OLIVEIRA DE AZEMEIS' },
    { 'pdv': '76117', 'city': 'OVAR' },
    { 'pdv': '2600', 'city': 'MESÃO FRIO ' },
    { 'pdv': '7006', 'city': 'REDONDO' },
    { 'pdv': '1820', 'city': 'ALCOCHETE       ' },
    { 'pdv': '3034', 'city': 'SERTÃ' },
    { 'pdv': '7534', 'city': 'AVINTES' },
    { 'pdv': '8164', 'city': 'PONTE DE SÔR' },
    { 'pdv': '8255', 'city': 'MASSAMÁ' },
    { 'pdv': '7600', 'city': 'PESO DA RÉGUA' },
    { 'pdv': '7366', 'city': 'SERPA' },
    { 'pdv': '8418', 'city': 'M. CAVALEIROS' },
    { 'pdv': '3946', 'city': 'SÃO MIGUEL PAREDES' },
    { 'pdv': '5285', 'city': 'VILA FLOR' },
    { 'pdv': '8594', 'city': 'ARGANIL' },
    { 'pdv': '9472', 'city': 'BARCELOS' },
    { 'pdv': '3291', 'city': 'ÓBIDOS' },
    { 'pdv': '3605', 'city': 'FELGUEIRAS        ' },
    { 'pdv': '3206', 'city': 'STª MARIA LAMAS' },
    { 'pdv': '7872', 'city': 'ERMESINDE' },
    { 'pdv': '6754', 'city': 'TERRAS DE BOURO' },
    { 'pdv': '4373', 'city': 'ARRIFANA' },
    { 'pdv': '7658', 'city': 'BENEDITA' },
    { 'pdv': '1266', 'city': 'V. N. POIARES' },
    { 'pdv': '6943', 'city': 'LAVOS' },
    { 'pdv': '2591', 'city': 'VILA VERDE' },
    { 'pdv': '7080', 'city': 'SANTIAGO CACEM' },
    { 'pdv': '1209', 'city': 'MOIMENTA DA BEIRA' },
    { 'pdv': '7603', 'city': 'VILAMOURA' },
    { 'pdv': '2778', 'city': 'PORTEL' },
    { 'pdv': '7058', 'city': 'PORTALEGRE      ' },
    { 'pdv': '1211', 'city': 'S. PEDRO DO SUL' },
    { 'pdv': '5929', 'city': 'QUARTEIRA' },
    { 'pdv': '3452', 'city': 'MÊDA' },
    { 'pdv': '76116', 'city': 'P. FERREIRA' },
    { 'pdv': '7564', 'city': 'SÃO BRÁS DE ALPORTEL' },
    { 'pdv': '5503', 'city': 'CARREGAL DO SAL' },
    { 'pdv': '6789', 'city': 'TROFA' },
    { 'pdv': '7502', 'city': 'ALJUSTREL' },
    { 'pdv': '76105', 'city': 'ALMEIRIM' },
    { 'pdv': '9476', 'city': 'VALONGO' },
    { 'pdv': '2774', 'city': 'VILA POUCA AGUIAR' },
    { 'pdv': '7625', 'city': 'SÃO JOÃO DO ESTORIL' },
    { 'pdv': '2058', 'city': 'PINHEL' },
    { 'pdv': '7826', 'city': 'VILA NOVA DA TELHA' },
    { 'pdv': '9637', 'city': 'MONCARAPACHO' },
    { 'pdv': '8062', 'city': 'FIGUEIRA CASTº RODRIGO' },
    { 'pdv': '7731', 'city': 'ARRAIOLOS' },
    { 'pdv': '8063', 'city': 'PENALVA DO CASTELO' },
    { 'pdv': '2375', 'city': 'TRANCOSO' },
    { 'pdv': '2217', 'city': 'MONDIM BASTO' },
    { 'pdv': '7964', 'city': 'SOBRAL MONTE AGRAÇO' },
    { 'pdv': '7626', 'city': 'MERCEANA' },
    { 'pdv': '6902', 'city': 'MANGUALDE' },
    { 'pdv': '8236', 'city': 'ALBERGARIA-A-VELHA' },
    { 'pdv': '9058', 'city': 'MINDE' },
    { 'pdv': '3036', 'city': 'VIANA DO ALENTEJO ' },
    { 'pdv': '9023', 'city': 'SAMORA CORREIA' },
    { 'pdv': '7825', 'city': 'CANELAS - V.N.GAIA' },
    { 'pdv': '6364', 'city': 'ANSIÃO' },
    { 'pdv': '9061', 'city': 'LOUSADA' },
    { 'pdv': '8238', 'city': 'CALDAS DA RAINHA' },
    { 'pdv': '7611', 'city': 'JUNCAL' },
    { 'pdv': '9062', 'city': 'VIZELA' },
    { 'pdv': '4454', 'city': 'ÍLHAVO' },
    { 'pdv': '1316', 'city': 'CELORICO BEIRA' },
    { 'pdv': '7334', 'city': 'MONTECHORO - ALBUFEIRA' },
    { 'pdv': '6301', 'city': 'SOURE' },
    { 'pdv': '2374', 'city': 'BATALHA' },
    { 'pdv': '6869', 'city': 'OLIVEIRA DE FRADES' },
    { 'pdv': '8190', 'city': 'SESIMBRA' },
    { 'pdv': '5175', 'city': 'CHAMUSCA' },
    { 'pdv': '5906', 'city': 'TRAMAGAL' },
    { 'pdv': '6892', 'city': 'ALPIARÇA ' },
    { 'pdv': '7958', 'city': 'SANTO ANTÓNIO DOS CAVALEIROS' },
    { 'pdv': '9650', 'city': 'SÃO JOÃO DA PESQUEIRA' },
    { 'pdv': '9452', 'city': 'ALCANEDE' },
    { 'pdv': '5469', 'city': 'VILA FRANCA DE XIRA' },
    { 'pdv': '3945', 'city': 'ALPENDORADA' },
    { 'pdv': '7936', 'city': 'OLIVEIRA DO DOURO' },
    { 'pdv': '5921', 'city': 'ARMAÇÃO PERA II ' },
    { 'pdv': '8937', 'city': 'PORTIMÃO - PRAIA DA ROCHA' },
    { 'pdv': '4872', 'city': 'VENDAS NOVAS' },
    { 'pdv': '8191', 'city': 'LORDELO' },
    { 'pdv': '7592', 'city': 'AÇOTEIAS' },
    { 'pdv': '7593', 'city': 'CERRO GRANDE' },
    { 'pdv': '7290', 'city': 'CALENDÁRIO' },
    { 'pdv': '8036', 'city': 'CAMPO MAIOR' },
    { 'pdv': '5985', 'city': 'SALVATERRA DE MAGOS' },
    { 'pdv': '7903', 'city': 'OLIVEIRA DO HOSPITAL' },
    { 'pdv': '6220', 'city': 'STA. COMBA DÃO' },
    { 'pdv': '76123', 'city': 'LOUSA' },
    { 'pdv': '9459', 'city': 'QTA DA PIEDADE' },
    { 'pdv': '5927', 'city': 'MONTE GORDO ' },
    { 'pdv': '8046', 'city': 'CASTRO VERDE' },
    { 'pdv': '9081', 'city': 'ARMAMAR' },
    { 'pdv': '5991', 'city': 'MIRANDA DO CORVO' },
    { 'pdv': '8419', 'city': 'M. CAVALEIROS II' },
    { 'pdv': '5736', 'city': 'LAGOA' }];
var r = new index_1.Rest();
PDVs.forEach(function (element) {
    var url = encodeURI("https://maps.googleapis.com/maps/api/geocode/json?address=Intermarché " + element.city + "&key=AIzaSyD4sEQaNWpU3KH-mVfCCxrPWWPYOJ4nDBQ");
    r.call(function (data, err) {
        if (err) {
            console.error(err);
        }
        else {
            if (data && data.body && data.body.results && data.body.results.length > 0) {
                console.log(element.pdv, ",", element.city, ",", data.body.results[0].geometry.location.lat, ",", data.body.results[0].geometry.location.lng);
            }
        }
        //console.log(data.body);
    }, "GET", url, body);
});
