import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  JoinColumn,
} from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { UserEntity } from '../../users/entities/user.entity';
import { GroupMemberEntity } from './group-member.entity';
import { RondaEntity } from './ronda.entity';

export enum EstadoGrupo {
  ACTIVO = 'activo',
  FINALIZADO = 'finalizado',
  CANCELADO = 'cancelado',
}

@Entity('grupo')
export class GrupoEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string = uuidv4();

  @Column()
  nombre?: string;

  @Column({ nullable: true })
  descripcion?: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  monto_cuota?: number;

  @Column({ type: 'enum', enum: EstadoGrupo, default: EstadoGrupo.ACTIVO })
  estado?: EstadoGrupo;

  @ManyToOne(() => UserEntity)
  @JoinColumn({ name: 'createdById' })
  createdBy?: UserEntity;

  @Column({ nullable: true })
  createdById?: number;

  @Column({ type: 'date' })
  fecha_inicio?: string;

  @Column({ type: 'date', nullable: true })
  fecha_fin?: string;

  @OneToMany(() => GroupMemberEntity, member => member.grupo, { cascade: true })
  miembros?: GroupMemberEntity[];

  @OneToMany(() => RondaEntity, ronda => ronda.grupo, { cascade: true })
  rondas?: RondaEntity[];

  @CreateDateColumn()
  createdAt?: Date;

  @UpdateDateColumn()
  updatedAt?: Date;

  @DeleteDateColumn()
  deletedAt?: Date;
}
