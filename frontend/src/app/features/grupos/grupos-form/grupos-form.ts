import { Component, signal, inject, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { GruposService } from '../grupos.service';
import { UsersService, type User } from '../../users/users.service';

interface MiembroForm {
  userId: number;
  nombre: string;
  orden: number;
}

@Component({
  selector: 'app-grupos-form',
  standalone: true,
  templateUrl: './grupos-form.html',
  imports: [CommonModule, FormsModule],
})
export class GruposFormComponent implements OnInit {
  gruposService = inject(GruposService);
  usersService = inject(UsersService);
  router = inject(Router);
  route = inject(ActivatedRoute);

  isEdit = signal(false);
  grupoId = signal<string | null>(null);
  loading = signal(false);
  saving = signal(false);
  error = signal('');

  nombre = signal('');
  descripcion = signal('');
  monto_cuota = signal<number>(100);
  fecha_inicio = signal('');
  miembros = signal<MiembroForm[]>([]);
  usuariosDisponibles = signal<User[]>([]);

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEdit.set(true);
      this.grupoId.set(id);
      this.loadGrupo(id);
    }

    this.usersService.getUsers().subscribe({
      next: (users) => this.usuariosDisponibles.set(users),
    });
  }

  loadGrupo(id: string) {
    this.loading.set(true);
    this.gruposService.getGrupo(id).subscribe({
      next: (grupo) => {
        this.nombre.set(grupo.nombre ?? '');
        this.descripcion.set(grupo.descripcion ?? '');
        this.monto_cuota.set(Number(grupo.monto_cuota));
        this.fecha_inicio.set(grupo.fecha_inicio ? grupo.fecha_inicio.split('T')[0] : '');
        this.miembros.set(
          (grupo.miembros ?? []).map(m => ({
            userId: m.userId,
            nombre: m.user?.nombre ?? '',
            orden: m.orden ?? 0,
          }))
        );
      },
      complete: () => this.loading.set(false),
    });
  }

  agregarMiembro() {
    this.miembros.update(list => [...list, { userId: 0, nombre: '', orden: list.length + 1 }]);
  }

  quitarMiembro(index: number) {
    this.miembros.update(list => {
      const newList = list.filter((_, i) => i !== index);
      return newList.map((m, i) => ({ ...m, orden: i + 1 }));
    });
  }

  onSelectUser(index: number, userId: unknown) {
    const id = Number(userId);
    const user = this.usuariosDisponibles().find(u => u.id === id);
    this.miembros.update(list => {
      const newList = [...list];
      newList[index] = { ...newList[index], userId: id, nombre: user?.nombre ?? '' };
      return newList;
    });
  }

  onSubmit() {
    if (!this.nombre() || !this.monto_cuota() || !this.fecha_inicio()) {
      this.error.set('Completa todos los campos obligatorios');
      return;
    }

    this.saving.set(true);
    this.error.set('');

    if (this.isEdit() && this.grupoId()) {
      this.gruposService.updateGrupo(this.grupoId()!, {
        nombre: this.nombre(),
        descripcion: this.descripcion() || undefined,
        monto_cuota: this.monto_cuota(),
        fecha_inicio: this.fecha_inicio(),
      }).subscribe({
        next: () => this.router.navigate(['/grupos', this.grupoId()]),
        error: (err) => {
          this.error.set(err.error?.message ?? 'Error al actualizar');
          this.saving.set(false);
        },
        complete: () => this.saving.set(false),
      });
    } else {
      this.gruposService.createGrupo({
        nombre: this.nombre(),
        descripcion: this.descripcion() || undefined,
        monto_cuota: this.monto_cuota(),
        fecha_inicio: this.fecha_inicio(),
        miembros: this.miembros().map(m => ({ userId: m.userId, orden: m.orden })),
      }).subscribe({
        next: (grupo) => this.router.navigate(['/grupos', grupo.id]),
        error: (err) => {
          const msg = err.error?.message;
          this.error.set(Array.isArray(msg) ? msg.join('. ') : (msg ?? 'Error al crear'));
          this.saving.set(false);
        },
        complete: () => this.saving.set(false),
      });
    }
  }

  cancelar() {
    if (this.grupoId()) {
      this.router.navigate(['/grupos', this.grupoId()]);
    } else {
      this.router.navigate(['/grupos']);
    }
  }
}
