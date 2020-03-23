import { Component, OnInit } from '@angular/core';
// import { Router } from '@angular/router';
import { NullValidationHandler, OAuthService, AuthConfig } from 'angular-oauth2-oidc';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.css']
})
export class WelcomeComponent implements OnInit {

  authConfig: AuthConfig = {
    issuer: 'http://localhost:9080/auth/realms/mail',
    redirectUri: window.location.origin + '/mail',
    clientId: 'mail-user',
    scope: 'openid profile email offline_access user',
    responseType: 'code',
    // at_hash is not present in JWT token
    disableAtHashCheck: true,
    showDebugInformation: true
  };

  public login() {
    this.oauthService.initLoginFlow();
  }

  public logoff() {
    this.oauthService.logOut();
  }

  private configure() {
    this.oauthService.configure(this.authConfig);
    this.oauthService.tokenValidationHandler = new NullValidationHandler();
    this.oauthService.loadDiscoveryDocumentAndTryLogin();
  }

  constructor(private oauthService: OAuthService) {
    this.configure();
  }

  // constructor(private router: Router) { }

  // public login() {
  //   this.router.navigate(['./mail']);
  // }

  ngOnInit(): void {
  }
}
