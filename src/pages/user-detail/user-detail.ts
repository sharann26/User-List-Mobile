import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Api } from '../../providers/api';

@Component({
  selector: 'page-user-detail',
  templateUrl: 'user-detail.html'
})
export class UserDetailPage {

  isListView = false;
  totalUserList = [];
  userList = [];
  userDetail = {};
  searchVal = '';
  constructor(private navCtrl: NavController, private navParams: NavParams, private api: Api) {

  }

  async ngOnInit() {
    this.isListView = this.api.isAdmin;
    if (this.isListView) {
      await this.gotoUserList();
    } else {
      await this.gotoUserDetails(this.navParams.get('email'));
    }
  }

  // to get register user list
  async gotoUserList() {
    this.isListView = true;
    const response: any = await this.api.httpGetMethod(this.api.host + this.api.apiType + this.api.versionOne + 'get_user_list', {});
    console.log(response);
    this.totalUserList = [];
    if(response.status == 0) {
      this.totalUserList = response.data || [];
      this.userList = this.totalUserList;
    } else {
      this.api.toastMsg('Unable to get user list');
    }
  }

  // To get user details
  async gotoUserDetails(email) {
    this.isListView = false;
    const params = {
      id: email
    }
    const response: any = await this.api.httpGetMethod(this.api.host + this.api.apiType + this.api.versionOne + 'get_user_list', params);
    console.log(response);
    this.userDetail = {};
    if(response.status == 0) {
      this.userDetail = response.data[0] || {};
    } else {
      this.api.toastMsg('Unable to get user information');
    }
    this.userDetail['user_name'] = `${this.userDetail['first_name'] + ' ' + this.userDetail['last_name']}`;
  }

  filterUsers() {
    this.userList = this.totalUserList.filter(value => {
      return ((value.email || '').toLowerCase().indexOf(this.searchVal.toLowerCase()) > -1 || (value.mobile || '').toLowerCase().indexOf(this.searchVal.toLowerCase()) > -1);

    })
  }
}
