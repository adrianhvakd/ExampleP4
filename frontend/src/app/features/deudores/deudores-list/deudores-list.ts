import { Component, signal, inject, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { GruposService } from '../../grupos/grupos.service';
import type { DeudorGroup } from '../../grupos/grupos.interfaces';

@Component({
  selector: 'app-deudores-list',
  standalone: true,
  templateUrl: './deudores-list.html',
  imports: [CommonModule, RouterLink],
})
export class DeudoresListComponent implements OnInit {
  gruposService = inject(GruposService);

  deudores = signal<DeudorGroup[]>([]);
  loading = signal(false);

  ngOnInit() {
    this.loadDeudores();
  }

  loadDeudores() {
    this.loading.set(true);
    this.gruposService.getDeudores().subscribe({
      next: (res) => this.deudores.set(res),
      complete: () => this.loading.set(false),
    });
  }
}
