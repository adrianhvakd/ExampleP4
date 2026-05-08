import { Component, signal, inject } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UsersService } from '../../users/users.service';

@Component({
  selector: 'app-usuarios-form',
  standalone: true,
  templateUrl: './usuarios-form.html',
  imports: [CommonModule, FormsModule],
})
export class UsuariosFormComponent {
  usersService = inject(UsersService);
  router = inject(Router);

  saving = signal(false);
  error = signal('');

  nombre = signal('');
  username = signal('');
  password = signal('');
  email = signal('');
  telefono = signal('');

  onSubmit() {
    if (!this.nombre() || !this.username() || !this.password()) {
      this.error.set('Nombre, username y password son obligatorios');
      return;
    }

    this.saving.set(true);
    this.error.set('');

    this.usersService.createUser({
      nombre: this.nombre(),
      username: this.username(),
      password: this.password(),
      email: this.email() || undefined,
      telefono: this.telefono() || undefined,
    }).subscribe({
      next: () => this.router.navigate(['/usuarios']),
      error: (err) => {
        this.error.set(err.error?.message ?? 'Error al crear usuario');
        this.saving.set(false);
      },
      complete: () => this.saving.set(false),
    });
  }

  cancelar() {
    this.router.navigate(['/usuarios']);
  }
}
