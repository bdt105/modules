"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const connexion_1 = require("./connexion");
let msSqlConfiguration = new connexion_1.SqlConfiguration();
msSqlConfiguration.driver = 'mssql';
msSqlConfiguration.databaseName = 'authentification';
msSqlConfiguration.databaseServer = "DESKTOP-URK387D\\SQLEXPRESS";
msSqlConfiguration.options = {
    "trustedConnection": true
};
msSqlConfiguration.userTableName = "[user]";
msSqlConfiguration.loginFieldName = "[login]";
msSqlConfiguration.passwordFieldName = "password";
let jwtConfiguration = new connexion_1.JwtConfiguration("secretbdt105", "$2a$10$Vn/zPCM8sSSaYnRmggV4CO", "userRequestEmail@mail.com", "adminToken"); // Optional - defines JWT parameters
var c = new connexion_1.Connexion(msSqlConfiguration, jwtConfiguration);
c.getJwt((err, data) => {
    console.log(data);
    console.error(err);
}, "bdt105@gmail.com", "1234", "[application]='msivirtual'", { expiresIn: '1y' }, false);
//# sourceMappingURL=testConMssql.js.map