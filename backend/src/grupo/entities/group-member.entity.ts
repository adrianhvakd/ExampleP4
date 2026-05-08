import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  Unique,
  JoinColumn,
} from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { GrupoEntity } from './grupo.entity';
import { UserEntity } from '../../users/entities/user.entity';
import { PagoEntity } from './pago.entity';

export enum EstadoMiembro {
  ACTIVO = 'activo',
  RETIRADO = 'retirado',
}

@Entity('group_member')
@Unique(['grupo', 'user'])
export class GroupMemberEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string = uuidv4();

  @ManyToOne(() => GrupoEntity, grupo => grupo.miembros)
  @JoinColumn({ name: 'grupoId' })
  grupo?: GrupoEntity;

  @Column()
  grupoId?: string;

  @ManyToOne(() => UserEntity, user => user.membresias)
  @JoinColumn({ name: 'userId' })
  user?: UserEntity;

  @Column()
  userId?: number;

  @Column()
  orden?: number;

  @Column({ type: 'enum', enum: EstadoMiembro, default: EstadoMiembro.ACTIVO })
  estado?: EstadoMiembro;

  @OneToMany(() => PagoEntity, pago => pago.member)
  pagos?: PagoEntity[];

  @CreateDateColumn()
  createdAt?: Date;

  @UpdateDateColumn()
  updatedAt?: Date;
}
