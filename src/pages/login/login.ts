import { Component, OnInit } from '@angular/core';
import { NavController } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserDetailPage } from '../user-detail/user-detail';
import { Api } from '../../providers/api';

@Component({
  selector: 'page-login',

  templateUrl: 'login.html'
})
export class LoginPage {
  isNewUser: boolean = false;
  registerForm: FormGroup;
  loginForm: FormGroup;
  admin_user_name = '';
  admin_pwd = '';
  submitted: boolean = false;
  genderList = ['Male', 'Female', 'Transgender'];
  areaOfIntestList = ['C++', '.Net', 'Java', 'Nodejs'];
  constructor(private navCtrl: NavController, private api: Api, private formBuilder: FormBuilder) {

  }

  async ngOnInit() {
    this.registerForm = this.formBuilder.group({
      f_name: ['', [Validators.maxLength(30), Validators.pattern('[a-zA-Z ]*'), Validators.required]],
      l_name: ['', [Validators.maxLength(30), Validators.pattern('[a-zA-Z ]*'), Validators.required]],
      gender: ['', [Validators.maxLength(15), Validators.pattern('[a-zA-Z ]*'), Validators.required]],
      email: ['', [Validators.email, Validators.required]],
      mobile: ['', [Validators.maxLength(10), Validators.pattern('[0-9]*'), Validators.required]],
      area_of_interest: ['', [Validators.required]],
      pwd: ['', [Validators.maxLength(30), Validators.required]],
      confirm_pwd: ['', [Validators.maxLength(30), Validators.required]],
    });
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.email, Validators.required]],
      pwd: ['', [Validators.maxLength(30), Validators.required]]
    });
    const response: any = await this.api.httpGetMethod(this.api.host + this.api.apiType + this.api.versionOne + 'admin-credentials', {});
    if (response.status == 0) {
      this.admin_user_name = response.data.username;
      this.admin_pwd = response.data.password
    }
    console.log(this.curntForm);
  }

  async registerUser() {
    const ret: any = await this.validateForm();
    if (ret)
      return
    const params = {
      first_name: this.curntForm.f_name.value,
      last_name: this.curntForm.l_name.value,
      gender: this.curntForm.gender.value,
      email: this.curntForm.email.value,
      mobile_no: this.curntForm.mobile.value,
      area_of_interest: (this.curntForm.area_of_interest.value).toString(),
      password: this.curntForm.pwd.value
    };
    const response: any = await this.api.httpPostMethod(this.api.host + this.api.apiType + this.api.versionOne + 'signup', params);
    console.log(response);
    if (response.status == 0) {
      this.navCtrl.setRoot(UserDetailPage, { email: this.curntForm.email.value });
    } else {
      this.api.toastMsg(response.message);
    }
  }

  async loginUser() {
    const ret: any = await this.validateForm();
    if (ret)
      return
    this.api.isAdmin = ((this.curntForm.email.value || '').toLowerCase() == this.admin_user_name && (this.curntForm.pwd.value || '').toLowerCase() == this.admin_pwd) ? true : false;
    if (this.api.isAdmin) {
      this.navCtrl.setRoot(UserDetailPage, { email: this.curntForm.email.value });
    } else {
      const params = this.loginForm.getRawValue();
      const response: any = await this.api.httpPostMethod(this.api.host + this.api.authType + this.api.versionOne + 'login', params);
      console.log(response);
      if (response.status == 0) {
        this.navCtrl.setRoot(UserDetailPage, { email: this.curntForm.email.value });
      } else {
        this.api.toastMsg(response.message);
      }
    }
  }

  goToRegisterOrLogin() {
    this.submitted = false;
    this.registerForm.reset();
    this.loginForm.reset();
    this.isNewUser = !this.isNewUser;
  }

  validateForm() {
    this.submitted = true;
    if (this.isNewUser && (this.curntForm.pwd.value).trim() != (this.curntForm.confirm_pwd.value).trim()) {
      this.curntForm.confirm_pwd.setErrors({ isNotSame: true });
    }
    const invalid = !this.isNewUser ? this.loginForm.invalid : this.registerForm.invalid;
    if (invalid) this.api.toastMsg('Please all fields');
    return invalid;
  }

  get curntForm() { return (this.isNewUser ? this.registerForm.controls : this.loginForm.controls) }

  omitValidation() {
    if (this.curntForm.email.value == 'admin') {
      this.curntForm.email.setValidators([Validators.required]);
      this.curntForm.email.updateValueAndValidity();
    } else {
      this.curntForm.email.setValidators([Validators.email, Validators.required]);
      this.curntForm.email.updateValueAndValidity();
    }
  }
}
