import { Module } from '@nestjs/common';
import { PagoController } from './pago.controller';
import { PagoEntity } from '../grupo/entities/pago.entity';
import { RondaEntity } from '../grupo/entities/ronda.entity';
import { GroupMemberEntity } from '../grupo/entities/group-member.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([PagoEntity, RondaEntity, GroupMemberEntity])],
  controllers: [PagoController],
})
export class PagoModule {}