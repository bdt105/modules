"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var connexion_1 = require("./connexion");
var mySqlConfiguration = new connexion_1.MySqlConfiguration("localhost", 3306, "root", "root", "connexion", "user", "login", "password"); // Optional - defines host, port, user, password and database to connect to MySql
var jwtConfiguration = new connexion_1.JwtConfiguration("secretbdt105", "$2a$10$abcdefabcdefabcdefabcd", "userRequestEmail@mail.com", "adminToken"); // Optional - defines JWT parameters
var c = new connexion_1.Connexion(mySqlConfiguration, jwtConfiguration);
var token = c.createJwt({ "login": "connexion" }, { expiresIn: '10y' });
c.checkToken(function (data, error) {
    var x = 1;
}, token);
//# sourceMappingURL=test.js.map