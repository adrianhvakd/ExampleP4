import { Component, signal, inject, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { GruposService } from '../grupos.service';
import type { Grupo } from '../grupos.interfaces';

@Component({
  selector: 'app-grupos-list',
  standalone: true,
  templateUrl: './grupos-list.html',
  imports: [CommonModule, FormsModule, RouterLink],
})
export class GruposListComponent implements OnInit {
  gruposService = inject(GruposService);
  router = inject(Router);

  grupos = signal<Grupo[]>([]);
  loading = signal(false);
  search = signal('');
  page = signal(1);
  lastPage = signal(1);
  total = signal(0);

  ngOnInit() {
    this.loadGrupos();
  }

  loadGrupos() {
    this.loading.set(true);
    this.gruposService.getGrupos(this.page(), 10, this.search() || undefined).subscribe({
      next: (res) => {
        this.grupos.set(res.data);
        this.total.set(res.total);
        this.lastPage.set(res.lastPage);
      },
      complete: () => this.loading.set(false),
    });
  }

  onSearch() {
    this.page.set(1);
    this.loadGrupos();
  }

  nextPage() {
    if (this.page() < this.lastPage()) {
      this.page.update(p => p + 1);
      this.loadGrupos();
    }
  }

  prevPage() {
    if (this.page() > 1) {
      this.page.update(p => p - 1);
      this.loadGrupos();
    }
  }

  verGrupo(id: string) {
    this.router.navigate(['/grupos', id]);
  }
}
