import { Connexion, SqlConfiguration, JwtConfiguration } from './connexion';

let mySqlConfiguration = null;

let jwtConfiguration = new JwtConfiguration("secretbdt105", "$2a$10$Vn/zPCM8sSSaYnRmggV4CO",
    "userRequestEmail@mail.com", "adminToken"); // Optional - defines JWT parameters

var c = new Connexion(mySqlConfiguration, jwtConfiguration);

let token = c.createJwt({"login":"connexion"}, { expiresIn: '10y' });

c.checkToken((data: any, error: any) => {
    console.log("data", JSON.stringify(data, null, 4),"error", error);
}, token)