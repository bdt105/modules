"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const connexion_1 = require("./connexion");
let mySqlConfiguration = null;
let jwtConfiguration = new connexion_1.JwtConfiguration("secretbdt105", "$2a$10$Vn/zPCM8sSSaYnRmggV4CO", "userRequestEmail@mail.com", "adminToken"); // Optional - defines JWT parameters
var c = new connexion_1.Connexion(mySqlConfiguration, jwtConfiguration);
let token = c.createJwt({ "login": "connexion" }, { expiresIn: '10y' });
c.checkToken((data, error) => {
    console.log("data", JSON.stringify(data, null, 4), "error", error);
}, token);
//# sourceMappingURL=createToken.js.map