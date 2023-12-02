import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { BackendApiService } from '../services/backend-api.service';

@Component({
  selector: 'app-voter-dashboard',
  templateUrl: './voter-dashboard.component.html',
  styleUrls: ['./voter-dashboard.component.css']
})
export class VoterDashboardComponent {

	userData!: any;
	selectedElectionID!: string;
	electionList: any = [];
	candidateList: any = [];
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
		this.userData = localStorage.getItem("UserData");
		this.userData = JSON.parse(this.userData);
		this.fetchUnVotedElection();
	}

	ngOnInit() {
		
	}

	public logout() {
		this.apiService.logout();
        this.Router.navigateByUrl('');
    }

	public fetchUnVotedElection() {
		this.apiService.fetchUnVotedElection(this.userData.userID).subscribe((res: any) => {
			if (res && res.data && res.data.length) {
                res.data.forEach((element: any) => {
                    const date = new Date(element.electionDate);
                    element.electionDate = date.toLocaleString('en-US', this.dateFormatOptions);
                    element.view_options = element.electionName + ' (' + element.electionID + ')';
                });
                this.electionList = res.data;
            }
		}, (error) => {
			console.log(error);
		});
	}

	public fetchAllCandidates() {
        if (this.selectedElectionID) {
            this.candidateList = [];
            this.apiService.fetchCandidateForElections(this.selectedElectionID, 1).subscribe((res: any) => {
                if (res && res.data && res.data.length) {
                    this.candidateList = res.data;
                    this.candidateList.forEach((element: any)=> {
                        const date = new Date(element.dob);
                        element.dob = date.toLocaleString('en-US', {
							year: 'numeric',
							month: 'long',
							day: 'numeric'
						});
                        // element.dob = new Date(element.dob);
                    });
                }
            }, (error) => {
                console.log(error);
            });;
        }
    }

	public voteForACandidate(candidate: any) {
		this.apiService.voteForACandidate(this.selectedElectionID, candidate.passport_id, this.userData.userID).subscribe((res: any) => {
			if (res && res.voting) {
				this.candidateList = [];
				this.fetchUnVotedElection();
			}
		}, (error) => {
			console.log(error);
		});;
    }
}
