import { Component, signal, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../auth/auth.service';
import { UsersService, type User } from '../users/users.service';

@Component({
  selector: 'app-perfil',
  standalone: true,
  templateUrl: './perfil.html',
  imports: [CommonModule, FormsModule],
})
export class PerfilComponent implements OnInit {
  authService = inject(AuthService);
  usersService = inject(UsersService);

  user = signal<User | null>(null);
  loading = signal(false);
  editing = signal(false);
  saving = signal(false);
  error = signal('');

  editNombre = signal('');
  editEmail = signal('');
  editTelefono = signal('');

  ngOnInit() {
    this.loadProfile();
  }

  loadProfile() {
    this.loading.set(true);
    this.authService.getProfile().subscribe({
      next: (u) => {
        this.user.set(u);
        this.editNombre.set(u.nombre ?? '');
        this.editEmail.set(u.email ?? '');
        this.editTelefono.set(u.telefono ?? '');
      },
      complete: () => this.loading.set(false),
    });
  }

  toggleEdit() {
    this.editing.update(v => !v);
  }

  save() {
    const u = this.user();
    if (!u) return;

    this.saving.set(true);
    this.error.set('');

    this.usersService.updateUser(u.id!, {
      nombre: this.editNombre(),
      email: this.editEmail() || undefined,
      telefono: this.editTelefono() || undefined,
    }).subscribe({
      next: (updated) => {
        this.user.set(updated);
        this.editing.set(false);
      },
      error: (err) => {
        this.error.set(err.error?.message ?? 'Error al guardar');
      },
      complete: () => this.saving.set(false),
    });
  }
}
