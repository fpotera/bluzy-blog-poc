/*  Copyright 2023 Florin Potera

    Licensed under the Apache License, Version 2.0 (the "License");
    you may not use this file except in compliance with the License.
    You may obtain a copy of the License at

        http://www.apache.org/licenses/LICENSE-2.0

    Unless required by applicable law or agreed to in writing, software
    distributed under the License is distributed on an "AS IS" BASIS,
    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
    See the License for the specific language governing permissions and
    limitations under the License.
*/

import { Component } from '@angular/core';
import { Router, RouterOutlet, RouterLinkWithHref } from '@angular/router';

import { filter } from 'rxjs/operators';
import { OAuthService } from 'angular-oauth2-oidc';

import { authConfig } from './oauth.config';
import { UserComponent } from './user/user.component';
import { HomeComponent } from './home/home.component';

@Component({
  standalone: true,
  // tslint:disable-next-line:component-selector
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.sass'],
  imports: [RouterOutlet,RouterLinkWithHref,UserComponent,HomeComponent]
})
export class AppComponent {
  constructor(private router: Router, private oauthService: OAuthService) {
    this.configureCodeFlow();

    this.oauthService.events
      .pipe(filter((e) => e.type === 'token_received'))
      .subscribe((_) => {
        console.debug('state', this.oauthService.state);
        this.oauthService.loadUserProfile();

        const scopes = this.oauthService.getGrantedScopes();
        console.debug('scopes', scopes);
      });
  }

  private configureCodeFlow() {
    this.oauthService.configure(authConfig);
    this.oauthService.loadDiscoveryDocumentAndTryLogin().then((_) => {});

    this.oauthService.setupAutomaticSilentRefresh();
  }
}
