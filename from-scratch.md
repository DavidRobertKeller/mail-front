generate Angular project:
```shell
npm install -g @angular/cli
ng new mail-front
cd mail-front
ng add @angular/material
ng generate @angular/material:navigation mailmenu
```

update app.component.html

```html
<router-outlet></router-outlet>
```

update app.module.ts
```typescript
import { RouterModule, Routes } from '@angular/router';
...
const appRoutes: Routes = [
  {
    path: 'mail',
    component: MailmenuComponent,
  },
  { path: '',
    redirectTo: '/mail',
    pathMatch: 'full',
  },
];
....
imports: [
      RouterModule.forRoot(appRoutes),
...
]
```

update mailmenu.component.html, in SideNav tag set attribute fixedInViewport=false 

```html
<mat-sidenav-container class="sidenav-container">
  <mat-sidenav #drawer class="sidenav" fixedInViewport=false
      [attr.role]="(isHandset$ | async) ? 'dialog' : 'navigation'"
      [mode]="(isHandset$ | async) ? 'over' : 'side'"
      [opened]="(isHandset$ | async) === false"

```



rearrange items in mailmenu.component.html

```html
<mat-toolbar color="primary">
  <button
    type="button"
    aria-label="Toggle sidenav"
    mat-icon-button
    (click)="drawer.toggle()"
    *ngIf="isHandset$ | async">
    <mat-icon aria-label="Side nav toggle icon">menu</mat-icon>
  </button>
  <span>mail-front</span>
</mat-toolbar>

<mat-sidenav-container class="sidenav-container">
  <mat-sidenav #drawer class="sidenav" fixedInViewport=false
      [attr.role]="(isHandset$ | async) ? 'dialog' : 'navigation'"
      [mode]="(isHandset$ | async) ? 'over' : 'side'"
      [opened]="(isHandset$ | async) === false">
    <mat-toolbar>Menu</mat-toolbar>
    <mat-nav-list>
      <a mat-list-item href="#">Link 1</a>
      <a mat-list-item href="#">Link 2</a>
      <a mat-list-item href="#">Link 3</a>
    </mat-nav-list>
  </mat-sidenav>
  <mat-sidenav-content>
    <!-- Add Content Here -->
  </mat-sidenav-content>
</mat-sidenav-container>
```

build maillist
```shell
ng generate @angular/material:table maillist
```

Update routes in app.module.ts
```typescript
import { MaillistComponent } from './maillist/maillist.component';
...
const appRoutes: Routes = [
  {
    path: 'mail',
    component: MailmenuComponent,
    children: [
      { path: 'list', component: MaillistComponent, outlet: 'side'},
   ]
  },
```

update mailmenu.component.html
```html
<mat-sidenav-container class="sidenav-container">
  <mat-sidenav #drawer class="sidenav" fixedInViewport=false
      [attr.role]="(isHandset$ | async) ? 'dialog' : 'navigation'"
      [mode]="(isHandset$ | async) ? 'over' : 'side'"
      [opened]="(isHandset$ | async) === false">
    <mat-toolbar>Mail</mat-toolbar>
    <mat-nav-list>
      <a mat-list-item [routerLink]="['/mail', {outlets: { side: ['list'] } }]" >List</a>
    </mat-nav-list>
  </mat-sidenav>
  <mat-sidenav-content>
    <router-outlet name="side"></router-outlet>
  </mat-sidenav-content>
</mat-sidenav-container>
```



build mailform
```shell
ng generate @angular/material:address-form mailform
```

Update routes in app.module.ts
```typescript
const appRoutes: Routes = [
  {
    path: 'mails',
    component: MailmenuComponent,
    children: [
      { path: 'list', component: MaillistComponent, outlet: 'side'},
      { path: 'add', component: MailformComponent, outlet: 'side'}
   ]
  },
```

update mailmenu.component.html
```html
<mat-sidenav-container class="sidenav-container">
...
    <mat-nav-list>
      <a mat-list-item [routerLink]="['/mails', {outlets: { side: ['list'] } }]" >List</a>
      <a mat-list-item [routerLink]="['/mails', {outlets: { side: ['add'] } }]" >Write</a>
    </mat-nav-list>
...
</mat-sidenav-container>
```


build welcome component
```shell
ng generate component welcome
```

update welcome.component.html
```html
<button class="btn btn-default" (click)="login()">
  Login
</button>
```


update welcome.component.ts

```typescript
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.css']
})
export class WelcomeComponent implements OnInit {

  constructor(private router: Router) { }

  public login() {
    this.router.navigate(['./mail']);
  }

  ngOnInit(): void {
  }
}
```

2 components are avalaible for OIDC :
* 9,4 k Weekly DL : https://www.npmjs.com/package/angular-auth-oidc-client
* 45 k Weekly DL : https://www.npmjs.com/package/angular-oauth2-oidc

We will use the most downloaded component : 'angular-oauth2-oidc'
```shell
npm i angular-oauth2-oidc --save
```

update app.module.ts

```typescript
import { HttpClientModule } from '@angular/common/http';
import { OAuthModule } from 'angular-oauth2-oidc';
...
@NgModule({
...
  imports: [
    RouterModule.forRoot(appRoutes),
    HttpClientModule,
    OAuthModule.forRoot({
      resourceServer: {
          allowedUrls: ['http://localhost:8080/api'],
          sendAccessToken: true
      }
    }),
```


update app.component.ts
```typescript
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
```


update welcome.component.ts

```typescript
import { NullValidationHandler, OAuthService, AuthConfig } from 'angular-oauth2-oidc';
...
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
}
```
