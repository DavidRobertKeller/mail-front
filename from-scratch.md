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
    path: 'mails',
    component: MailmenuComponent,
  },
  { path: '',
    redirectTo: '/mails',
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


