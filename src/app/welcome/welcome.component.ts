import { Component, OnInit } from '@angular/core';
// import { Router } from '@angular/router';
import { NullValidationHandler, OAuthService, AuthConfig } from 'angular-oauth2-oidc';
import { AppComponent } from '../app.component';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.css']
})
export class WelcomeComponent implements OnInit {

  public login() {
    this.appComponent.signIn();
  }

  constructor(private appComponent: AppComponent) {
  }

  // constructor(private router: Router) { }

  // public login() {
  //   this.router.navigate(['./mail']);
  // }

  ngOnInit(): void {
  }
}
