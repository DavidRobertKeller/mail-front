import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { MaterialModule } from './material.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MailmenuComponent } from './mailmenu/mailmenu.component';
import { LayoutModule } from '@angular/cdk/layout';
import { MaillistComponent } from './maillist/maillist.component';
import { MailformComponent } from './mailform/mailform.component';
import { ReactiveFormsModule } from '@angular/forms';
import { WelcomeComponent } from './welcome/welcome.component';
import { HttpClientModule } from '@angular/common/http';
import { OAuthModule } from 'angular-oauth2-oidc';
import { DndDirective } from './dnd.directive';
import { ProgressComponent } from './progress/progress.component';

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
    WelcomeComponent,
    DndDirective,
    ProgressComponent,
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
    ReactiveFormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
