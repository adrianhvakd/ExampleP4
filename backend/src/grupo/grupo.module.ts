import { Module } from '@nestjs/common';
import { GrupoService } from './grupo.service';
import { GrupoController } from './grupo.controller';
import { GrupoEntity } from './entities/grupo.entity';
import { GroupMemberEntity } from './entities/group-member.entity';
import { RondaEntity } from './entities/ronda.entity';
import { PagoEntity } from './entities/pago.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forFeature([GrupoEntity, GroupMemberEntity, RondaEntity, PagoEntity]),
  ],
  controllers: [GrupoController],
  providers: [GrupoService],
  exports: [GrupoService],
})
export class GrupoModule {}
