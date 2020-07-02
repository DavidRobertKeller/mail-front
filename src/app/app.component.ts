import { Component } from '@angular/core';
import { AuthConfig, OAuthService, NullValidationHandler } from 'angular-oauth2-oidc';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'mail-front';
  isAuthorized = false;

  authConfig: AuthConfig = {
    issuer: 'http://localhost:9080/auth/realms/mail',
    redirectUri: window.location.origin + '/',
    clientId: 'spa-mail-user',
    scope: 'openid profile email offline_access user',
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
    this.oauthService.setupAutomaticSilentRefresh();
    this.oauthService.tokenValidationHandler = new NullValidationHandler();

    this.oauthService.loadDiscoveryDocument().then(() => {
      this.oauthService.tryLogin().then(() => {
        this.isAuthorized = this.oauthService.hasValidAccessToken();
        if (this.isAuthorized) {
          this.router.navigate(['/mail']);
        } else {
          this.router.navigate(['/welcome']);
        }
      });
    });
  }

  constructor(private oauthService: OAuthService, private router: Router) {
    this.configure();
  }
}
