import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { LoginPageComponent } from './login-page/login-page.component';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';
import { VoterDashboardComponent } from './voter-dashboard/voter-dashboard.component';
import { CandidateDashboardComponent } from './candidate-dashboard/candidate-dashboard.component';
import { CandidateRegistrationComponent } from './candidate-registration/candidate-registration.component';
import { VoterRegistrationComponent } from './voter-registration/voter-registration.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginPageComponent,
    VoterDashboardComponent,
    AdminDashboardComponent,
    CandidateDashboardComponent,
    CandidateRegistrationComponent,
    VoterRegistrationComponent
  ],
  imports: [
    FormsModule,
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    RouterModule.forRoot([
      {path: '', component: LoginPageComponent},
      {path: 'admin-dashboard', component: AdminDashboardComponent},
      {path: 'voter-dashboard', component: VoterDashboardComponent},
      {path: 'candidate-dashboard', component: CandidateDashboardComponent},
      {path: 'candidate-registration', component: CandidateRegistrationComponent},
      {path: 'voter-registration', component: VoterRegistrationComponent},
    ]),
  ],
  providers: [],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  bootstrap: [AppComponent]
})
export class AppModule { }
