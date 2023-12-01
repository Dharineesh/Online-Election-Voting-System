import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { BackendApiService } from '../services/backend-api.service';

@Component({
  selector: 'login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.css']
})
export class LoginPageComponent {

	constructor(private Router: Router, private apiService: BackendApiService) {}

	userid!: string;
	password!: string;

	loginType: string = 'Admin';


	public async login() {
		let response: any;
		await this.apiService.login(this.userid, this.password, this.loginType).subscribe((res: any) => {
			response = res;
			if (response && response.message && response.message == 'Login successful') {
				let userData = {
					userData: response.data[0],
					userID: this.userid,
					userType: this.loginType
				};
				localStorage.setItem("UserData", JSON.stringify(userData));
				if (this.loginType == 'Admin') {
					this.Router.navigateByUrl('/admin-dashboard');
				} else if (this.loginType == 'Voter') {
					this.Router.navigateByUrl('/voter-dashboard');
				} else {
					if (response.accountVerified) {
						this.Router.navigateByUrl('/candidate-dashboard');
					} else {
						window.alert("Your account is not verified. Please contact admin to be verified!");
					}
				}
			} else if (response && response.error && response.error == 'Invalid credentials') {
				window.alert("Invalid UserId or Password!");
			}
		}, (error) => {
			console.log(error);
		});;

	}

	public changeLoginType(type: string) {
		this.loginType = type;
	}

	public openReg() {
		if (this.loginType != 'Admin') {
			if (this.loginType == 'Voter') {
				this.Router.navigateByUrl('/voter-registration');
			} else {
				this.Router.navigateByUrl('/candidate-registration');
			}
		}
	}

}
