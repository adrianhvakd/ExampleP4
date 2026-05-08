import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { GrupoEntity } from '../../grupo/entities/grupo.entity';
import { GroupMemberEntity } from '../../grupo/entities/group-member.entity';

@Entity('users')
export class UserEntity {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column()
  nombre?: string;

  @Column()
  username?: string;

  @Column()
  password?: string;

  @Column({ nullable: true })
  email?: string;

  @Column({ nullable: true })
  telefono?: string;

  @OneToMany(() => GrupoEntity, grupo => grupo.createdBy)
  gruposCreados?: GrupoEntity[];

  @OneToMany(() => GroupMemberEntity, member => member.user)
  membresias?: GroupMemberEntity[];

  @CreateDateColumn()
  createdAt?: Date;

  @UpdateDateColumn()
  updatedAt?: Date;

  @DeleteDateColumn()
  deletedAt?: Date;
}
