import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ToastController } from 'ionic-angular';

@Injectable()
export class Api {

    host = 'http://localhost:3000/';
    apiType = 'api/';
    authType = 'auth/';
    versionOne = 'v1/';
    versionTwo = 'v2/';
    isAdmin: boolean = false;
    constructor(private http: HttpClient, private toastController: ToastController) {

    }

    // Http GET method
    httpGetMethod(url, params) {
        const options: any = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json'
            }),
            observe: "response",
            params: params
        };
        return new Promise(async (resolve, reject) => {
            await this.http.get(url, options).subscribe((response: any) => {
                resolve(response.body);
            });
        })
    }

    // Http POST method
    httpPostMethod(url, params) {
        const options: any = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json'
            }),
            observe: "response"
        };
        return new Promise(async (resolve, reject) => {
            await this.http.post(url, params, options).subscribe((response: any) => {
                resolve(response.body);
            });
        });
    }

    // Toast message
    async toastMsg(msg) {
        const toast = await this.toastController.create({
            message: msg,
            duration: 2000
        });
        toast.present();
    }
}