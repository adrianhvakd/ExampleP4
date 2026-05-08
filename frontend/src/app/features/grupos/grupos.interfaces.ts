export interface Grupo {
  id: string;
  nombre: string;
  descripcion?: string;
  monto_cuota: number;
  estado: 'activo' | 'finalizado' | 'cancelado';
  createdBy: { id: number; nombre: string; username: string };
  createdById: number;
  fecha_inicio: string;
  fecha_fin?: string;
  miembros: GroupMember[];
  rondas: Ronda[];
  createdAt: string;
}

export interface GroupMember {
  id: string;
  grupoId: string;
  userId: number;
  user: { id: number; nombre: string; username: string };
  orden: number;
  estado: 'activo' | 'retirado';
  pagos?: Pago[];
}

export interface Ronda {
  id: string;
  grupoId: string;
  numero: number;
  beneficiarioMemberId: string;
  beneficiarioMember: GroupMember;
  monto_total: number;
  cuota_individual?: number;
  fecha_programada: string;
  fecha_cobro?: string;
  estado: 'pendiente' | 'cobrada' | 'cancelada';
  pagos: Pago[];
}

export interface Pago {
  id: string;
  rondaId: string;
  memberId: string;
  member: GroupMember;
  pagado: boolean;
  fecha_pago?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  lastPage: number;
}

export interface CreateGrupoPayload {
  nombre: string;
  descripcion?: string;
  monto_cuota: number;
  fecha_inicio: string;
  miembros: { userId: number; orden: number }[];
}

export interface DeudorGroup {
  grupo: Grupo;
  deudores: DeudorItem[];
}

export interface DeudorItem {
  id: string;
  rondaId: string;
  rondaNumero: number;
  fechaProgramada: string;
  miembro: string;
  miembroId: string;
  monto: number;
}
