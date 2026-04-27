import { Component, signal, inject } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import type { LoginData } from '../auth.interfaces';

@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: './login.html',
  imports: [FormsModule, CommonModule],
})
export class LoginComponent {
  username: string = '';
  password: string = '';
  loading = signal<boolean>(false);
  error = signal<string>('');
  showPassword = signal<boolean>(false);
  authService = inject(AuthService);
  router = inject(Router);

  onSubmit() {
    this.loading.set(true);
    this.error.set('');
    this.authService.login(this.username, this.password).subscribe({
      next: (response: Partial<LoginData>) => {
        if (response.access_token) {
          this.authService.saveToken(response.access_token);
          this.router.navigate(['/dashboard']);
          return true;
        }
        this.error.set('Credenciales incorrectas');
        return false;
      },
      error: (error) => {
        this.error.set(error.error.message);
        this.loading.set(false);
        return false;
      },
      complete: () => this.loading.set(false),
    });
  }
}
