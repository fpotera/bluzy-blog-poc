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

import { importProvidersFrom } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { provideHttpClient } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';
import { MatNativeDateModule } from '@angular/material/core';
import { PreloadAllModules, provideRouter, withDebugTracing, withPreloading, withRouterConfig } from '@angular/router';

import { provideOAuthClient } from 'angular-oauth2-oidc';

import { AppComponent } from './app/app.component';
import { APP_ROUTES } from './app/app.routes';

bootstrapApplication(AppComponent, {
  providers: [
    provideAnimations(),
    provideHttpClient(),
    provideOAuthClient(),
    importProvidersFrom(MatNativeDateModule),
    provideRouter(APP_ROUTES, withPreloading(PreloadAllModules), withDebugTracing())
  ]
}).catch(err => console.error(err));
