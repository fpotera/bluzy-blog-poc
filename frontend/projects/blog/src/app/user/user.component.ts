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
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { MatTableModule } from '@angular/material/table';
import { OAuthService } from 'angular-oauth2-oidc';
import { first } from 'rxjs/operators';

import { User } from './user';

@Component({
  standalone: true,
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.sass'],
  imports: [MatTableModule]
})
export class UserComponent {
  dataSource: User[] = [];
  displayedColumns: string[] = ['id', 'username'];

  constructor(private oauthService: OAuthService, private http: HttpClient) {
    var bearerToken = `Bearer ${this.oauthService.getAccessToken()}`;

    this.http.get<User[]>('/api/users', {responseType: 'json', observe: 'body', headers: new HttpHeaders({Authorization: bearerToken})})
        .pipe(first())
        .subscribe((body) => {
          console.log('Result:', body);
          this.dataSource = body;
        });
  }
}
