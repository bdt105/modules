"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const connexion_1 = require("./connexion");
let mySqlConfiguration = new connexion_1.MySqlConfiguration("localhost", 3306, "root", "root", "connexion", "user", "login", "password"); // Optional - defines host, port, user, password and database to connect to MySql
let jwtConfiguration = new connexion_1.JwtConfiguration("secretbdt105", "$2a$10$abcdefabcdefabcdefabcd", "userRequestEmail@mail.com", "adminToken"); // Optional - defines JWT parameters
var c = new connexion_1.Connexion(mySqlConfiguration, jwtConfiguration);
let token = "ya29.ImCzB2AH7o6-BXixR6x9RA7AhuslJ4E6ClRYIeL_jbdP9ms2t3OrhGcjTbNd5BFEfK62CKWiyHlGCpsvUZXqI8-IL7f2DNwcgkVjgzzQvEl348rkxJ-31mIjchjIILaZ4EU";
c.checkToken(token);
//# sourceMappingURL=test.js.map