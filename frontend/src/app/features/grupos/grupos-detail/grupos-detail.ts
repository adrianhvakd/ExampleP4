import { Component, signal, inject, OnInit, computed } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { GruposService } from '../grupos.service';
import { UsersService, type User } from '../../users/users.service';
import type { Grupo, Ronda, Pago } from '../grupos.interfaces';

@Component({
  selector: 'app-grupos-detail',
  standalone: true,
  templateUrl: './grupos-detail.html',
  imports: [CommonModule, FormsModule],
})
export class GruposDetailComponent implements OnInit {
  gruposService = inject(GruposService);
  usersService = inject(UsersService);
  route = inject(ActivatedRoute);
  router = inject(Router);

  grupo = signal<Grupo | null>(null);
  loading = signal(false);
  toggling = signal<string | null>(null);

  showAddMember = signal(false);
  usuariosDisponibles = signal<User[]>([]);
  nuevoUserId = signal<number>(0);
  nuevoOrden = signal<number>(0);
  savingMember = signal(false);

  deudoresDelGrupo = computed(() => {
    const g = this.grupo();
    if (!g?.rondas) return [];
    const items: { rondaNumero: number; fecha: string; miembro: string; monto: number; pagoId: string }[] = [];
    for (const ronda of g.rondas) {
      for (const pago of ronda.pagos) {
        if (!pago.pagado) {
          items.push({
            rondaNumero: ronda.numero,
            fecha: ronda.fecha_programada,
            miembro: pago.member?.user?.nombre ?? 'N/A',
            monto: ronda.cuota_individual ?? 0,
            pagoId: pago.id,
          });
        }
      }
    }
    return items;
  });

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) this.loadGrupo(id);
  }

  loadGrupo(id: string) {
    this.loading.set(true);
    this.gruposService.getGrupo(id).subscribe({
      next: (g) => {
        this.grupo.set(g);
        this.nuevoOrden.set((g.miembros?.length ?? 0) + 1);
      },
      complete: () => this.loading.set(false),
    });
  }

  abrirAddMember() {
    this.showAddMember.set(true);
    this.nuevoUserId.set(0);
    this.usersService.getUsers().subscribe({
      next: (users) => this.usuariosDisponibles.set(users),
    });
  }

  addMember() {
    const g = this.grupo();
    if (!g || !this.nuevoUserId()) return;

    this.savingMember.set(true);
    this.gruposService.addMember(g.id!, this.nuevoUserId(), this.nuevoOrden()).subscribe({
      next: (updated) => {
        this.grupo.set(updated);
        this.showAddMember.set(false);
        this.nuevoOrden.set((updated.miembros?.length ?? 0) + 1);
        this.savingMember.set(false);
      },
      error: () => this.savingMember.set(false),
    });
  }

  cobrarRonda(ronda: Ronda) {
    if (ronda.estado === 'cobrada') return;
    this.toggling.set(ronda.id);
    this.gruposService.cobrarRonda(ronda.id).subscribe({
      next: () => this.loadGrupo(this.grupo()!.id!),
      complete: () => this.toggling.set(null),
    });
  }

  togglePago(pagoId: string, pagado: boolean) {
    this.toggling.set(pagoId);
    const action = pagado
      ? this.gruposService.anularPago(pagoId)
      : this.gruposService.pagarPago(pagoId);

    action.subscribe({
      next: () => this.loadGrupo(this.grupo()!.id!),
      complete: () => this.toggling.set(null),
    });
  }

  getCuotaIndividual(): number {
    const g = this.grupo();
    if (!g) return 0;
    const activos = g.miembros?.filter(m => m.estado === 'activo').length ?? 0;
    return activos > 0 ? Number(g.monto_cuota) / activos : 0;
  }

  getMiembrosActivos(): number {
    return this.grupo()?.miembros?.filter(m => m.estado === 'activo').length ?? 0;
  }

  getPagadosCount(pagos: { pagado: boolean }[]): number {
    return pagos.filter(p => p.pagado).length;
  }

  editar() {
    this.router.navigate(['/grupos', this.grupo()!.id, 'editar']);
  }

  volver() {
    this.router.navigate(['/grupos']);
  }
}
