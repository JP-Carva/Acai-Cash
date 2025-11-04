import { Routes } from '@angular/router';

import { LoginComponent } from './login/login.component';
import { CreateAccountComponent } from './create-account/create-account.component';

export default [
  { path: '', data: { breadcrumb: 'Login' }, component: LoginComponent },
  { path: 'create-account', component: CreateAccountComponent }
] as Routes;
