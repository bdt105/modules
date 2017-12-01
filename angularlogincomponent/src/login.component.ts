import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Toolbox } from 'bdt105toolbox/dist';


import { GenericComponent } from '../../component/generic.component';
import { ConnexionService } from '../../service/connexion.service';
import { TranslateService } from '../../service/translate.service';
import { TranslateComponent } from '../../component/translate/translate.component';

@Component({
    selector: 'login',
    templateUrl: './login.component.html',
    providers: [ConnexionService, TranslateService]
})

export class LoginComponent implements GenericComponent{
    login: string;
    password: string;
    rememberMe: boolean;
    connexion: any;
    message: string;
    error: string;

    private toolbox: Toolbox;

    @Output() connected: EventEmitter<any> = new EventEmitter<any>();
    @Output() disconnected: EventEmitter<any> = new EventEmitter<any>();

    constructor(private connexionService: ConnexionService, private translateService: TranslateService, private router: Router) {
        this.toolbox = new Toolbox();
    }

    ngOnInit(){
        this.connexion = this.connexionService.getConnexion();
    }

    translate(text: string){
        return this.translateService.translate(text);
    }

    connect(){
        this.connexionService.connect(
            (data: any) => this.connexionSuccess(data), 
            (data: any) => this.connexionFailure(data),
            this.login, this.password, this.rememberMe);
    }

    private connexionSuccess(connexion: any){
        this.message = this.translateService.translate("Connexion succeded");
        this.connexion = this.connexionService.getConnexion();
        this.connected.emit(this.connexion);
        let url: string = this.toolbox.readFromStorage("redirectUrl");
        if (url){
            this.toolbox.removeFromStorage("redirectUrl");
            url = window.location.href.replace("/login", url);
            console.log(url);
            window.location.href = url;
        }else{
            this.router.navigate["/play/__first"];
            location.reload();
        }
    }

    private connexionFailure = function(data: any){
        this.error = this.translateService.translate("Connexion impossible! Please double check your data connexion");
        this.connexion = null;
        this.disconnected.emit(null);
    }

    disconnect(){
        this.connexionService.disconnect();
        this.connexion = null;
        this.disconnected.emit(null);
    }

}