"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var connexion_1 = require("./connexion");
var msSqlConfiguration = new connexion_1.SqlConfiguration();
msSqlConfiguration.driver = 'mssql';
msSqlConfiguration.databaseName = 'stockbudens';
msSqlConfiguration.databaseServer = "DESKTOP-URK387D\\SQLEXPRESS";
msSqlConfiguration.options = {
    "trustedConnection": true
};
msSqlConfiguration.userTableName = "user";
msSqlConfiguration.loginFieldName = "login";
msSqlConfiguration.passwordFieldName = "password";
var jwtConfiguration = new connexion_1.JwtConfiguration("secretbdt105", "$2a$10$Vn/zPCM8sSSaYnRmggV4CO", "userRequestEmail@mail.com", "adminToken"); // Optional - defines JWT parameters
var c = new connexion_1.Connexion(msSqlConfiguration, jwtConfiguration);
c.getJwt(function (err, data) {
    console.log(data);
    console.error(err);
}, "bdt105@gmail.com", "123", "[application]='msivirtual'", { expiresIn: '1y' }, false);
var token = c.createJwt({ "login": "connexion" }, { expiresIn: '10y' });
c.checkToken(function (data, error) {
    console.log("data", JSON.stringify(data, null, 4), "error", error);
}, token);
//# sourceMappingURL=testConMssql.js.map