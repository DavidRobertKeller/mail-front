import { Component } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { AppComponent } from '../app.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-mailmenu',
  templateUrl: './mailmenu.component.html',
  styleUrls: ['./mailmenu.component.css']
})
export class MailmenuComponent {
  public login: string = null;

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay()
    );


  constructor(
      private breakpointObserver: BreakpointObserver,
      private appComponent: AppComponent,
      private router: Router) {
    const identity: any = appComponent.getOAuthService().getIdentityClaims();

    if (identity !== null) {
      this.login = identity.given_name + ' ' + identity.family_name + ' (' + identity.preferred_username + ')';
    }
  }

  public logout() {
    this.appComponent.signOut();
    this.router.navigate(['/']);
  }
}
