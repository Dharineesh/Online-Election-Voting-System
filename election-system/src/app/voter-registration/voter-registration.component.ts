import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { BackendApiService } from '../services/backend-api.service';

@Component({
  selector: 'app-voter-registration',
  templateUrl: './voter-registration.component.html',
  styleUrls: ['./voter-registration.component.css']
})
export class VoterRegistrationComponent {

    username!: string;
	passport_id!: string;
    dob!: Date;
    electionList: any = [];
    selectedElectionID!: string;

    constructor(private Router: Router, private apiService: BackendApiService) {
        // this.fetchAllElections();
    }

    public back() {
        this.Router.navigateByUrl('');
    }

    public async register() {
        if (this.username && this.passport_id && this.dob) {
            if (this.apiService.getAge(this.dob) >= 18) {
                let response: any;
                await this.apiService.voterRegistration(this.username, this.passport_id, this.dob).subscribe((res: any) => {
                    if (res && res.voterFound) {
                        window.alert("Voter already registered. Please login to vote!");
                    } else {
                       window.alert(res.message);
                       this.Router.navigateByUrl('');
                    }
                    
                }, (error) => {
                    console.log(error);
                });;
            } else {
                window.alert("Minimum age required for the voter is 18. Sorry you are not eligible for voting!");
            }
        } else {
            window.alert("Please enter all the details!");
        }

	}

}
