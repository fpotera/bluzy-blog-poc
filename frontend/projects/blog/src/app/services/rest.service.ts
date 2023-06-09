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

import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { OAuthService } from 'angular-oauth2-oidc';
import { first } from 'rxjs';

import { User } from '../entities/user';

@Injectable()
export class ResttService {
  constructor(
    private oauthService: OAuthService,
    private http: HttpClient
  ) {}

  public users: Array<User> = [];

  getUsers(): void {
    let url = '/api/users';
    const responseType = 'json';
    const observe = 'body';
    const headers = new HttpHeaders().set('Accept', 'application/json')
        .set('Authorization', 'Bearer ' + this.oauthService.getAccessToken());

    this.http.get<User[]>(url, {responseType, observe, headers})
        .pipe(first())
        .subscribe((body) => {
            console.log('Result:', body);
            this.users = body;
        });
  }
}
