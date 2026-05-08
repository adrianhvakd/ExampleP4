import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment.development';

export interface User {
  id: number;
  nombre: string;
  username: string;
  email?: string;
  telefono?: string;
  createdAt: string;
}

@Injectable({ providedIn: 'root' })
export class UsersService {
  http = inject(HttpClient);

  getUsers() {
    return this.http.get<User[]>(`${environment.apiUrl}/users`);
  }

  getUser(id: number) {
    return this.http.get<User>(`${environment.apiUrl}/users/${id}`);
  }

  createUser(data: { nombre: string; username: string; password: string; email?: string; telefono?: string }) {
    return this.http.post<User>(`${environment.apiUrl}/users`, data);
  }

  updateUser(id: number, data: Partial<{ nombre: string; username: string; password: string; email: string; telefono: string }>) {
    return this.http.patch<User>(`${environment.apiUrl}/users/${id}`, data);
  }

  deleteUser(id: number) {
    return this.http.delete(`${environment.apiUrl}/users/${id}`);
  }
}
