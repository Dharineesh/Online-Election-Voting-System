import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
    providedIn: 'root'
})
export class BackendApiService {

    private apiUrl = 'http://localhost:3000/';

    constructor(private http: HttpClient) { }

    public logout() {
        localStorage.removeItem("UserData");
    }

    public login(userID: string, password: string, userType: string) {
        const body = { userID, password, userType };
        const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    
        return this.http.post(this.apiUrl + 'login', body, { headers });
    }

    public addNewElection(electionID: string, electionName: string, electionDate: Date) {
        const body = { electionID, electionName, electionDate };
        const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    
        return this.http.post(this.apiUrl + 'addNewElection', body, { headers });
    }

    public voteForACandidate(electionID: string, candidateID: string, voterID: Date) {
        const body = { electionID, candidateID, voterID };
        const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    
        return this.http.post(this.apiUrl + 'voteForACandidate', body, { headers });
    }

    public saveCandidateDetails(payload: any) {
        const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    
        return this.http.post(this.apiUrl + 'saveCandidateDetails', payload, { headers });
    }

    public fetchCandidateForElections(electionID: string, verified: number) {
        const body = { electionID, verified };
        const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    
        return this.http.post(this.apiUrl + 'fetchCandidateForElections', body, { headers });
    }

    public fetchElectionResults(electionID: string) {
        const body = { electionID };
        const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    
        return this.http.post(this.apiUrl + 'fetchElectionResults', body, { headers });
    }

    public fetchUnVotedElection(userID: string) {
        const body = { userID };
        const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    
        return this.http.post(this.apiUrl + 'fetchUnVotedElection', body, { headers });
    }

    public fetchCandidateData(userID: string) {
        const body = { userID };
        const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    
        return this.http.post(this.apiUrl + 'fetchCandidateData', body, { headers });
    }

    public updateCondidateStatus(passport_id: string, electionID: string, verified: number) {
        const body = { electionID, passport_id, verified };
        const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    
        return this.http.post(this.apiUrl + 'updateCondidateStatus', body, { headers });
    }
    
    public fetchAllElections() {
        const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    
        return this.http.get(this.apiUrl + 'fetchAllElections', { headers });
    }
    
    public fetchAllVoters() {
        const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    
        return this.http.get(this.apiUrl + 'fetchAllVoters', { headers });
    }

    public voterRegistration(username: string, passport_id: string, dob: Date) {
        const body = { username, passport_id,  dob};
        const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    
        return this.http.post(this.apiUrl + 'voter-registration', body, { headers });
    }

    public candidateRegistration(username: string, passport_id: string, educational_qualification: string, dob: Date, residence: string, campaign_desc: string, electionID: string) {
        const body = { username, passport_id, educational_qualification, dob, residence, campaign_desc, electionID };
        const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    
        return this.http.post(this.apiUrl + 'candidate-registration', body, { headers });
    }

    public getAge(dateString: any) {
        var today = new Date();
        var birthDate = new Date(dateString);
        var age = today.getFullYear() - birthDate.getFullYear();
        var m = today.getMonth() - birthDate.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        return age;
    }

}
