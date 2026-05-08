import { Module } from '@nestjs/common';
import { RondaController } from './ronda.controller';
import { RondaEntity } from '../grupo/entities/ronda.entity';
import { PagoEntity } from '../grupo/entities/pago.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([RondaEntity, PagoEntity])],
  controllers: [RondaController],
})
export class RondaModule {}