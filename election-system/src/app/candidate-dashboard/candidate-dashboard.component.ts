import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { BackendApiService } from '../services/backend-api.service';

@Component({
  selector: 'app-candidate-dashboard',
  templateUrl: './candidate-dashboard.component.html',
  styleUrls: ['./candidate-dashboard.component.css']
})
export class CandidateDashboardComponent {

    userData!: any;

    username!: string;
	passport_id!: string;
    dob!: any;
    residence!: string;
    educational_qualification!: string;
    campaign_desc!: string;
    electionData: string = 'sfeasdfsd';
    email: string = 'dharan@123.com';

    constructor(private Router: Router, private apiService: BackendApiService) {
        this.userData = localStorage.getItem("UserData");
		this.userData = JSON.parse(this.userData);
        this.fetchCandidateData();
    }

    public logout() {
		this.apiService.logout();
        this.Router.navigateByUrl('');
    }

    public fetchCandidateData() {
        this.apiService.fetchCandidateData(this.userData.userID).subscribe((res: any) => {
			if (res && res.data && res.data.length == 1) {
                let tempdob = new Date(res.data[0].dob)
                var year = tempdob.toLocaleString("default", { year: "numeric" });
                var month = tempdob.toLocaleString("default", { month: "2-digit" });
                var day = tempdob.toLocaleString("default", { day: "2-digit" });
                this.username = res.data[0].username;
                this.passport_id = res.data[0].passport_id;
                this.dob = year + '-' + month  + '-' + day;
                this.residence = res.data[0].residence;
                this.educational_qualification = res.data[0].educational_qualification;
                this.campaign_desc = res.data[0].campaign_desc;
                this.electionData = res.data[0].electionName + ' (' + res.data[0].electionID + ')';
            }
		}, (error) => {
			console.log(error);
		});;
    }

    public updateProfile() {
        if (this.dob && this.residence && this.educational_qualification && this.campaign_desc) {
            if (this.apiService.getAge(this.dob) >= 23) {
                const payload = {
                    userID: this.userData.userID,
                    dob: this.dob,
                    residence: this.residence,
                    educational_qualification: this.educational_qualification,
                    campaign_desc: this.campaign_desc
                }
                this.apiService.saveCandidateDetails(payload).subscribe((res: any) => {
                    if (res && res.res) {
                        window.alert(res.message);
                        this.fetchCandidateData();
                    }
                }, (error) => {
                    console.log(error);
                });;
            } else {
                window.alert("Minimum age required for the candidate is 23. Sorry you cannot update details");
            }
        } else {
            window.alert("Please enter all the details!");
        }
    }

  
}
