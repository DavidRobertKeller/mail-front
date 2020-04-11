import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AppComponent } from './app.component';
import { MaterialModule } from './material.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MailmenuComponent } from './mailmenu/mailmenu.component';
import { LayoutModule } from '@angular/cdk/layout';
import { MaillistComponent } from './maillist/maillist.component';
// import { MatTableModule } from '@angular/material/table';
// import { MatPaginatorModule } from '@angular/material/paginator';
// import { MatSortModule } from '@angular/material/sort';
import { MailformComponent } from './mailform/mailform.component';
// import { MatInputModule } from '@angular/material/input';
// import { MatSelectModule } from '@angular/material/select';
// import { MatRadioModule } from '@angular/material/radio';
// import { MatCardModule } from '@angular/material/card';
import { ReactiveFormsModule } from '@angular/forms';
import { WelcomeComponent } from './welcome/welcome.component';
import { HttpClientModule } from '@angular/common/http';
import { OAuthModule } from 'angular-oauth2-oidc';

const appRoutes: Routes = [
  {
    path: 'mail',
    component: MailmenuComponent,
    children: [
      { path: 'list', component: MaillistComponent, outlet: 'side'},
      { path: 'add', component: MailformComponent, outlet: 'side'}
   ]
  },
  {
    path: 'welcome',
    component: WelcomeComponent,
  },
  { path: '',
    redirectTo: '/welcome',
    pathMatch: 'full',
  },
];

@NgModule({
  declarations: [
    AppComponent,
    MailmenuComponent,
    MaillistComponent,
    MailformComponent,
    WelcomeComponent
  ],
  imports: [
    RouterModule.forRoot(appRoutes),
    HttpClientModule,
    OAuthModule.forRoot({
      resourceServer: {
          allowedUrls: ['http://localhost:8080/api'],
          sendAccessToken: true
      }
    }),
    BrowserModule,
    BrowserAnimationsModule,
    LayoutModule,
    MaterialModule,
    // MatToolbarModule,
    // MatButtonModule,
    // MatSidenavModule,
    // MatIconModule,
    // MatListModule,
    // MatTableModule,
    // MatPaginatorModule,
    // MatSortModule,
    // MatInputModule,
    // MatSelectModule,
    // MatRadioModule,
    // MatCardModule,
    ReactiveFormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
