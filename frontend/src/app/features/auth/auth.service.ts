import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment.development';
import type { User } from '../users/users.service';

@Injectable({ providedIn: 'root' })
export class AuthService {
  http = inject(HttpClient);

  private isBrowser(): boolean{
    return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';
  }
  login(username: string, password: string) {
    return this.http.post(environment.apiUrl + '/auth/login', { username, password });
  }

  saveToken(token: string){
    localStorage.setItem('access_token', token);
  }

  getToken():string | null{
    return localStorage.getItem('access_token');
  }

  logout(){
    localStorage.removeItem('access_token');
  }

  isLoggedIn(): boolean {
    if(this.isBrowser())
      return (this.getToken() !== null);
    return false;
  }

  getProfile() {
    return this.http.get<User>(`${environment.apiUrl}/auth/profile`);
  }
}
