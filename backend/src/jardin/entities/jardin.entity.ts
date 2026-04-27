import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { v4 as uuidv4 } from 'uuid';

export enum TipoPlanta {
  ROSA = 'rosa',
  CLAVEL = 'clavel',
  CESPED = 'cesped',
}

@Entity('jardin')
export class JardinEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string = uuidv4();

  @Column()
  nombre?: string;

  @Column({ type: 'enum', enum: TipoPlanta, default: TipoPlanta.CESPED })
  tipo?: TipoPlanta;

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  largo?: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  ancho?: number;

  @CreateDateColumn()
  createdAt?: Date;

  @UpdateDateColumn()
  updatedAt?: Date;

  @DeleteDateColumn()
  deletedAt?: Date;
}
