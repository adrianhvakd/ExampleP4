import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  JoinColumn,
} from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { RondaEntity } from './ronda.entity';
import { GroupMemberEntity } from './group-member.entity';

@Entity('pago')
export class PagoEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string = uuidv4();

  @ManyToOne(() => RondaEntity, ronda => ronda.pagos)
  @JoinColumn({ name: 'rondaId' })
  ronda?: RondaEntity;

  @Column()
  rondaId?: string;

  @ManyToOne(() => GroupMemberEntity, member => member.pagos)
  @JoinColumn({ name: 'memberId' })
  member?: GroupMemberEntity;

  @Column()
  memberId?: string;

  @Column({ default: false })
  pagado?: boolean;

  @Column({ type: 'date', nullable: true })
  fecha_pago?: string;

  @CreateDateColumn()
  createdAt?: Date;

  @UpdateDateColumn()
  updatedAt?: Date;
}
