import { Component } from '@angular/core';
import { AuthConfig, OAuthService, NullValidationHandler } from 'angular-oauth2-oidc';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'mail-front';

  authConfig: AuthConfig = {
    issuer: 'http://localhost:9080/auth/realms/mail',
    redirectUri: window.location.origin + '/mail',
    clientId: 'mail-user',
    scope: 'openid profile email offline_access users',
    responseType: 'code',
    // at_hash is not present in JWT token
    disableAtHashCheck: true,
    showDebugInformation: true
  };

  public signIn() {
    this.oauthService.initLoginFlow();
  }

  public signOut() {
    this.oauthService.logOut();
  }

  public getOAuthService() {
    return this.oauthService;
  }

  private configure() {
    this.oauthService.configure(this.authConfig);
    this.oauthService.tokenValidationHandler = new NullValidationHandler();
    this.oauthService.loadDiscoveryDocumentAndTryLogin();
  }

  constructor(private oauthService: OAuthService) {
    this.configure();
  }
}
