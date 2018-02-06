import { decode } from 'punycode';
import { Toolbox } from "bdt105toolbox/dist";

export class MySqlConfiguration {
    public host: string;
    public user: string;
    public password: string;
    public port: number;
    public database: string;

    public userTableName: string;
    public loginFieldName: string;
    public passwordFieldName: string;

    constructor(host: string, port: number, user: string, password: string, database: string, userTableName: string = null, loginFieldName: string = null, passwordFieldName: string = null){
        this.host = host;
        this.user = user;
        this.password = password;
        this.port = port;
        this.database = database;
        this.userTableName = userTableName;
        this.loginFieldName = loginFieldName;
        this.passwordFieldName = passwordFieldName;
    }
}

export class JwtConfiguration {
    public secret: string;
    public salt: string;
    public userRequestEmail: string;
    public adminToken: string;

    constructor(secret: string, salt: string, userRequestEmail: string, adminToken: string){
        this.secret = secret;
        this.salt = salt;
        this.userRequestEmail = userRequestEmail;
        this.adminToken = adminToken;
    }
}

export class Token {
    public token: string;
    public status: string;
    public decoded: string;
    constructor(token: string, status: string, decoded: string){
        this.token = token;
        this.status = status;
        this.decoded = decoded;
    }
}

export class Connexion {
    private mySql: any;
    private sqlConnexion: any;
    private jsonwebtoken: any;
    public static readonly jwtStatusOk = "OK";
    public static readonly jwtStatusERR = "ERR";
    private toolbox: Toolbox;
    
    public mySqlConfiguration: MySqlConfiguration;
    public jwtConfiguration: JwtConfiguration;

    public rows: any;
    public err: any;
    public iss: string;
    public permissions: string;
    public epirationDate: number;

    constructor (mySqlConfiguration: MySqlConfiguration = null, jwtConfiguration: JwtConfiguration = null){
        this.toolbox = new Toolbox();
        this.mySqlConfiguration = mySqlConfiguration;
        this.jwtConfiguration = jwtConfiguration;
        this.mySql = require('mysql');
        this.jsonwebtoken = require('jsonwebtoken');
    }

    private log (text: string){
        console.log(text);
    }

    private connectSql(){
        this.sqlConnexion = this.mySql.createConnection({
            "host": this.mySqlConfiguration.host,
            "user": this.mySqlConfiguration.user,
            "port": this.mySqlConfiguration.port,
            "password": this.mySqlConfiguration.password,
            "database": this.mySqlConfiguration.database
        });
        if (this.sqlConnexion){
            let err = this.sqlConnexion.connect(
                (err: any) => this.callbackConnect(err)
            );
        }
    }

    private releaseSql(){
        if (this.sqlConnexion){
            this.log('Connexion to the database as id ' + this.sqlConnexion.threadId + ' ended !');
            this.sqlConnexion.end();
            this.sqlConnexion = null;
        }
    }

    private callbackConnect(err: any){
        this.err = err;        
        if (err) { 
            console.error('error connecting: ' + err.stack); 
            this.releaseSql();        
            return; 
        } 
        this.log('Connected to the database as id ' + this.sqlConnexion.threadId);
    }

    private callbackGetJwt(callback: Function, err: any, rows: any, plainPassword: string){
        this.rows = rows;
        this.err = err;
        let user: any = {};
        let jwt = null;
        this.releaseSql();
        if (rows && rows.length > 0){
            let encryptedPassword = this.encrypt(plainPassword);
            user = rows[0];
            if (encryptedPassword === user[this.mySqlConfiguration.passwordFieldName]){
                jwt = this.jsonwebtoken.sign(user, this.jwtConfiguration.secret);    
                callback(err, jwt);
            }else{
                callback("Wrong password or login", jwt);
            }
        }else{
            if (callback){
                callback(err, jwt);
            }
        }
    }

    private callbackQuerySql(callback: Function, err: any, rows: any){
        this.releaseSql();

        if (callback){
            callback(err, rows);
        }
    }

    querySql(callback: Function, sql: string){
        this.connectSql();
        this.sqlConnexion.query(sql, 
            (err: any, rows: any) => this.callbackQuerySql(callback, err, rows));
    }

    getJwt(callback: Function, login: string, plainPassword: string, where: string = null){
        this.connectSql();
        if (this.sqlConnexion){
            let sql = "select * from " + this.mySqlConfiguration.userTableName + " where " + this.mySqlConfiguration.loginFieldName + " = '" + login + "'" + (where ? " and " + where : "");
            this.sqlConnexion.query(sql, 
                (err: any, rows: any) => this.callbackGetJwt(callback, err, rows, plainPassword));
        }
    }

    checkJwt(token: string): Token{
        var jwt = require('jsonwebtoken');
        try {
            var decoded = jwt.verify(token, this.jwtConfiguration.secret);
            if (decoded.iduser){
                this.log("User Id: " + decoded.iduser + ", login: " + decoded.login);
            }
            return new Token(token, Connexion.jwtStatusOk, decoded);
        } catch(err) {
            return new Token(token, Connexion.jwtStatusERR, null);
        }        
    }

    isTokenValid(token: string) : boolean{
        let jwt = this.checkJwt(token);
        if (jwt){
            return jwt.status == Connexion.jwtStatusOk;
        }else{
            return false;
        }
    }

    encrypt(plain: string): string{
        var bcrypt = require('bcryptjs');
        var hash = bcrypt.hashSync(plain, this.jwtConfiguration.salt);        
        return hash;
    }

    compareEncrypt(encrypted: string, plain: string): boolean{
        var bcrypt = require('bcryptjs');
        var hash = bcrypt.hashSync(plain, this.jwtConfiguration.salt);        
        return hash === encrypted;
    }

    tryConnectSql(){
        this.connectSql();
    }
    
}