import { Component, signal, inject, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { UsersService, type User } from '../../users/users.service';

@Component({
  selector: 'app-usuarios-list',
  standalone: true,
  templateUrl: './usuarios-list.html',
  imports: [CommonModule, RouterLink],
})
export class UsuariosListComponent implements OnInit {
  usersService = inject(UsersService);
  router = inject(Router);

  usuarios = signal<User[]>([]);
  loading = signal(false);
  deleting = signal<number | null>(null);
  error = signal('');

  ngOnInit() {
    this.loadUsuarios();
  }

  loadUsuarios() {
    this.loading.set(true);
    this.usersService.getUsers().subscribe({
      next: (res) => this.usuarios.set(res),
      complete: () => this.loading.set(false),
    });
  }

  eliminar(id: number) {
    if (!confirm('¿Eliminar este usuario?')) return;
    this.deleting.set(id);
    this.usersService.deleteUser(id).subscribe({
      next: () => this.loadUsuarios(),
      error: (err) => this.error.set(err.error?.message ?? 'Error al eliminar'),
      complete: () => this.deleting.set(null),
    });
  }
}
