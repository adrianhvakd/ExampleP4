import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment.development';
import type { Grupo, PaginatedResponse, CreateGrupoPayload, Ronda, Pago, DeudorGroup } from './grupos.interfaces';

@Injectable({ providedIn: 'root' })
export class GruposService {
  http = inject(HttpClient);

  getGrupos(page = 1, limit = 10, nombre?: string) {
    let params = `page=${page}&limit=${limit}`;
    if (nombre) params += `&nombre=${nombre}`;
    return this.http.get<PaginatedResponse<Grupo>>(`${environment.apiUrl}/grupos?${params}`);
  }

  getGrupo(id: string) {
    return this.http.get<Grupo>(`${environment.apiUrl}/grupos/${id}`);
  }

  createGrupo(payload: CreateGrupoPayload) {
    return this.http.post<Grupo>(`${environment.apiUrl}/grupos`, payload);
  }

  updateGrupo(id: string, payload: Partial<CreateGrupoPayload>) {
    return this.http.patch<Grupo>(`${environment.apiUrl}/grupos/${id}`, payload);
  }

  deleteGrupo(id: string) {
    return this.http.delete(`${environment.apiUrl}/grupos/${id}`);
  }

  cobrarRonda(id: string) {
    return this.http.patch<Ronda>(`${environment.apiUrl}/rondas/${id}/cobrar`, {});
  }

  pagarPago(id: string) {
    return this.http.patch<Pago>(`${environment.apiUrl}/pagos/${id}/pagar`, {});
  }

  anularPago(id: string) {
    return this.http.patch<Pago>(`${environment.apiUrl}/pagos/${id}/anular`, {});
  }

  addMember(grupoId: string, userId: number, orden: number) {
    return this.http.post<Grupo>(`${environment.apiUrl}/grupos/${grupoId}/miembros`, { userId, orden });
  }

  getDeudores() {
    return this.http.get<DeudorGroup[]>(`${environment.apiUrl}/grupos/deudores`);
  }
}
