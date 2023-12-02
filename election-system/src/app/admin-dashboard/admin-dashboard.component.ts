import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { BackendApiService } from '../services/backend-api.service';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css']
})
export class AdminDashboardComponent {
    
    openDiv: number = 1;
    electionID!: string | null;
    electionName!: string | null;
    electionDate!: Date | null;
    candidateList: any = [];
    selectedElectionID_CanList!: any;
    approvedCandidateList: any = [];
    votersList: any = [];
    resultsList: any = [];

    electionList: any = [];
    selectedElectionID!: any;
    dateFormatOptions: any = {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        timeZoneName: 'short'
    };
    showCreateElection: boolean = false;


    constructor(private Router: Router, private apiService: BackendApiService) {
        this.fetchAllElections();
    }

    public open(val: number) {
        this.electionList = [];
        this.fetchAllElections();
        if (val == 1) {
            this.showCreateElection = false;
            this.electionDate = null;
            this.electionName = null;
            this.electionID = null;
        } else if (val == 3) {
            this.fetchAllVoters();
        }
        this.approvedCandidateList = [];
        this.approvedCandidateList = [];
        this.candidateList = [];
        this.resultsList = [];
        this.selectedElectionID = null;
        this.selectedElectionID_CanList = null;
        this.openDiv = val;
    }

    public addNewElection() {
        if (this.electionID && this.electionDate && this.electionName) {
            if (new Date(this.electionDate) > new Date()) {
                let response: any;
                this.apiService.addNewElection(this.electionID, this.electionName, this.electionDate).subscribe((res: any) => {
                    response = res;
                    window.alert(response.message);
                    if (response && response.res) {
                        this.showCreateElection = false;
                        this.electionID = null;
                        this.electionName = null;
                        this.electionDate = null;
                        this.fetchAllElections();
                    }
                }, (error) => {
                    console.log(error);
                });;
            } else {
                window.alert("Enter a proper voting deadline date");
            }
        } else {
            window.alert("Enter all the required fields!");
        }
    }

    private fetchAllElections() {
        this.apiService.fetchAllElections().subscribe((res: any) => {
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
        });;
    }

    public logout() {
        this.apiService.logout();
        this.Router.navigateByUrl('');
    }

    public showCreateElect() {
        this.showCreateElection = true;
    }

    public  onOptionSelected() {
        if (this.selectedElectionID) {
            this.candidateList = [];
            this.apiService.fetchCandidateForElections(this.selectedElectionID, 0).subscribe((res: any) => {
                if (res && res.data && res.data.length) {
                    this.candidateList = res.data;
                    this.candidateList.forEach((element: any)=> {
                        const date = new Date(element.dob);
                        element.dob = date.toLocaleString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                        });
                    });
                }
            }, (error) => {
                console.log(error);
            });;
        }
    }

    public candidateAction(candidate:any, action: string) {
        let option = 1;
        if (action === 'reject') {
            option = -1;
        }
        this.apiService.updateCondidateStatus(candidate.passport_id, this.selectedElectionID, option).subscribe((res: any) => {
            if (res) {
                window.alert(res.message);
                if (res.res) {
                    this.onOptionSelected();
                }
            }
        }, (error) => {
            console.log(error);
        });;
    }

    public changeOptionInCanList() {
        if (this.selectedElectionID_CanList) {
            this.approvedCandidateList = [];
            this.apiService.fetchCandidateForElections(this.selectedElectionID_CanList, 1).subscribe((res: any) => {
                if (res && res.data && res.data.length) {
                    this.approvedCandidateList = res.data;
                    this.approvedCandidateList.forEach((element: any)=> {
                        element.dob = new Date(element.dob);
                    });
                }
            }, (error) => {
                console.log(error);
            });;
        }
    }

    public fetchElectionResults() {
        if (this.selectedElectionID_CanList) {
            this.resultsList = [];
            this.apiService.fetchElectionResults(this.selectedElectionID_CanList).subscribe((res: any) => {
                if (res && res.data && res.data.length) {
                    this.resultsList = res.data;
                    this.resultsList.forEach((element: any)=> {
                        element.dob = new Date(element.dob);
                    });
                }
            }, (error) => {
                console.log(error);
            });;
        }
    }

    public fetchAllVoters() {
        this.votersList = [];
        this.apiService.fetchAllVoters().subscribe((res: any) => {
            if (res && res.data && res.data.length) {
                this.votersList = res.data;
                this.votersList.forEach((element: any)=> {
                    const date = new Date(element.dob);
                    element.dob = date.toLocaleString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                    });
                });
            }
        }, (error) => {
            console.log(error);
        });;
    }
}
