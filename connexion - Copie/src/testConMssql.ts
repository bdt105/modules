import { Connexion, SqlConfiguration, JwtConfiguration } from './connexion';

let msSqlConfiguration = new SqlConfiguration();
msSqlConfiguration.driver = 'mssql';
msSqlConfiguration.databaseName = 'stockbudens';
msSqlConfiguration.databaseServer = "DESKTOP-URK387D\\SQLEXPRESS";
msSqlConfiguration.options = {
    "trustedConnection": true 
}
msSqlConfiguration.userTableName = "user"
msSqlConfiguration.loginFieldName = "login"
msSqlConfiguration.passwordFieldName = "password"

let jwtConfiguration = new JwtConfiguration("secretbdt105", "$2a$10$Vn/zPCM8sSSaYnRmggV4CO",
    "userRequestEmail@mail.com", "adminToken"); // Optional - defines JWT parameters

var c = new Connexion(msSqlConfiguration, jwtConfiguration);

c.getJwt((err: any, data: any) => {
    console.log(data);
    console.error(err);
}, "bdt105@gmail.com", "123", "[application]='msivirtual'", { expiresIn: '1y'}, false);

let token = c.createJwt({ "login": "connexion" }, { expiresIn: '10y' });

c.checkToken((data: any, error: any) => {
    console.log("data", JSON.stringify(data, null, 4), "error", error);
}, token)