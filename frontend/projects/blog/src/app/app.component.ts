import { Component } from '@angular/core';
import { NgIf } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { OAuthService } from 'angular-oauth2-oidc';
import { filter, first } from 'rxjs/operators';

import { authConfig } from './oauth.config';

@Component({
  standalone: true,
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.sass'],
  imports: [NgIf]
})
export class AppComponent {
  title = 'blog';
  result: string | null = '';

  constructor(private oauthService: OAuthService, private http: HttpClient) {
    this.oauthService.configure(authConfig);
    this.oauthService.loadDiscoveryDocumentAndLogin();
    this.oauthService.setupAutomaticSilentRefresh();
    this.oauthService.events
    .pipe(filter((e) => e.type === 'token_received'))
    .subscribe((_) => this.oauthService.loadUserProfile());

    var bearerToken = 'Bearer '+this.oauthService.getAccessToken();

    this.http.get('/service/secured', {responseType: 'text', observe: 'response', headers: new HttpHeaders({Authorization: bearerToken})})
        .pipe(first())
        .subscribe((response) => {
          console.log('Result:', response.body);
          this.result = response.body;
        });
  }

  get userName(): string {
    const claims = this.oauthService.getIdentityClaims();
    if (!claims) return 'Null';
    return claims['given_name'];
  }

  get idToken(): string {
    return this.oauthService.getIdToken();
  }

  get accessToken(): string {
    return this.oauthService.getAccessToken();
  }

  refresh() {
    this.oauthService.refreshToken();
  }

  get serviceResult(): string | null {
    return this.result;
  }
}
