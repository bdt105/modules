import { decode } from 'punycode';
import { Toolbox } from "bdt105toolbox/dist";

export class MySqlConfiguration {
    public host: string;
    public user: string;
    public password: string;
    public port: string;
    public database: string;
}

export class JwtConfiguration {
    public secret: string;
    public salt: string;
    public userRequestEmail: string;
    public adminToken: string;
}

export class Connexion {
    private mySql: any;
    private sqlConnexion: any;
    private jsonwebtoken: any;
    private jwtStatusOk = "OK";
    private jwtStatusERR = "ERR";
    private toolbox: Toolbox;
    
    public mySqlConfiguration: MySqlConfiguration;
    public jwtConfiguration: JwtConfiguration;

    public rows: any;
    public err: any;
    public iss: string;
    public permissions: string;
    public epirationDate: number;
    public userTableName = "user";
    public loginFieldName = "login";
    public passwordFieldName = "password";

    constructor (mySqlConfiguration: MySqlConfiguration, jwtConfiguration: JwtConfiguration){
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
            if (encryptedPassword === user[this.passwordFieldName]){
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
            let sql = "select * from " + this.userTableName + " where " + this.loginFieldName + " = '" + login + "'" + (where ? " and " + where : "");
            this.sqlConnexion.query(sql, 
                (err: any, rows: any) => this.callbackGetJwt(callback, err, rows, plainPassword));
        }
    }

    checkJwt(token: string){
        var jwt = require('jsonwebtoken');
        try {
            var decoded = jwt.verify(token, this.jwtConfiguration.secret);
            if (decoded.iduser){
                this.log("User Id: " + decoded.iduser + ", login: " + decoded.login);
            }
            return {"token":token, "status": this.jwtStatusOk, "decoded": decoded};
        } catch(err) {
            return {"token":token, "status": this.jwtStatusERR, "decoded": null};
        }        
    }

    isTokenValid(token: string) : boolean{
        let jwt = this.checkJwt(token);
        if (jwt){
            return jwt.status == this.jwtStatusOk;
        }else{
            return false;
        }
    }

    encrypt(plain: string){
        var bcrypt = require('bcryptjs');
        var hash = bcrypt.hashSync(plain, this.jwtConfiguration.salt);        
        return hash;
    }

    compareEncrypt(encrypted: string, plain: string){
        var bcrypt = require('bcryptjs');
        var hash = bcrypt.hashSync(plain, this.jwtConfiguration.salt);        
        return hash === encrypted;
    }

    tryConnectSql(){
        this.connectSql();
    }
    
}