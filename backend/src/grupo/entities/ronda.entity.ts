import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  JoinColumn,
} from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { GrupoEntity } from './grupo.entity';
import { GroupMemberEntity } from './group-member.entity';
import { PagoEntity } from './pago.entity';

export enum EstadoRonda {
  PENDIENTE = 'pendiente',
  COBRADA = 'cobrada',
  CANCELADA = 'cancelada',
}

@Entity('ronda')
export class RondaEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string = uuidv4();

  @ManyToOne(() => GrupoEntity, grupo => grupo.rondas)
  @JoinColumn({ name: 'grupoId' })
  grupo?: GrupoEntity;

  @Column()
  grupoId?: string;

  @Column()
  numero?: number;

  @ManyToOne(() => GroupMemberEntity)
  @JoinColumn({ name: 'beneficiarioMemberId' })
  beneficiarioMember?: GroupMemberEntity;

  @Column()
  beneficiarioMemberId?: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  monto_total?: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  cuota_individual?: number;

  @Column({ type: 'date' })
  fecha_programada?: string;

  @Column({ type: 'date', nullable: true })
  fecha_cobro?: string;

  @Column({ type: 'enum', enum: EstadoRonda, default: EstadoRonda.PENDIENTE })
  estado?: EstadoRonda;

  @OneToMany(() => PagoEntity, pago => pago.ronda, { cascade: true })
  pagos?: PagoEntity[];

  @CreateDateColumn()
  createdAt?: Date;

  @UpdateDateColumn()
  updatedAt?: Date;
}
