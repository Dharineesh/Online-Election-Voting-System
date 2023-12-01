import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { BackendApiService } from '../services/backend-api.service';

@Component({
  selector: 'app-candidate-registration',
  templateUrl: './candidate-registration.component.html',
  styleUrls: ['./candidate-registration.component.css']
})
export class CandidateRegistrationComponent {

    username!: string;
	passport_id!: string;
    dob!: Date;
    residence!: string;
    educational_qualification!: string;
    campaign_desc!: string;
    selectedElectionID!: string;

    electionList: any = [];
    dateFormatOptions: any = {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        timeZoneName: 'short'
    };

    constructor(private Router: Router, private apiService: BackendApiService) {
        this.fetchAllElections();
    }

    public back() {
        this.Router.navigateByUrl('');
    }

    public async register() {
        if (this.username && this.passport_id && this.educational_qualification && this.dob && this.residence && this.campaign_desc && this.selectedElectionID) {
            if (this.apiService.getAge(this.dob) >= 23) {
                let response: any;
                await this.apiService.candidateRegistration(this.username, this.passport_id, this.educational_qualification, this.dob, this.residence,  this.campaign_desc, this.selectedElectionID).subscribe((res: any) => {
                    if (res && res.candidateFound) {
                        window.alert(res.message);
                    } else {
                       window.alert(res.message);
                       this.Router.navigateByUrl('');
                    }
                    
                }, (error) => {
                    console.log(error);
                });;
            } else {
                window.alert("Minimum age required for the candidate is 23. Sorry you are not eligible for the candidate!");
            }
        } else {
            window.alert("Please enter all the details!");
        }

	}

    private fetchAllElections() {
        this.apiService.fetchAllElections().subscribe((res: any) => {
            if (res && res.data && res.data.length) {
                res.data.forEach((element: any) => {
                    element.view_options = element.electionName + ' (' + element.electionID + ')';
                });
                this.electionList = res.data;
            }
        }, (error) => {
            console.log(error);
        });;
    }

    
}
