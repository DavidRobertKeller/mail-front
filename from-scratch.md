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
