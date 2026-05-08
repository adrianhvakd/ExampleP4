import { Controller, Get, Param, Patch } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RondaEntity, EstadoRonda } from './entities/ronda.entity';
import { PagoEntity } from './entities/pago.entity';
import { Repository } from 'typeorm';

@Controller('rondas')
export class RondaController {
  constructor(
    @InjectRepository(RondaEntity)
    private rondaRepository: Repository<RondaEntity>,
    @InjectRepository(PagoEntity)
    private pagoRepository: Repository<PagoEntity>,
  ) {}

  @Get()
  async findAll() {
    return await this.rondaRepository.find({
      relations: ['grupo', 'beneficiarioMember', 'beneficiarioMember.user', 'pagos', 'pagos.member', 'pagos.member.user'],
      order: { createdAt: 'DESC' },
    });
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.rondaRepository.findOne({
      where: { id },
      relations: ['grupo', 'beneficiarioMember', 'beneficiarioMember.user', 'pagos', 'pagos.member', 'pagos.member.user'],
    });
  }

  @Patch(':id/cobrar')
  async cobrar(@Param('id') id: string) {
    const hoy = new Date().toISOString().split('T')[0];
    await this.rondaRepository.update(id, {
      estado: EstadoRonda.COBRADA,
      fecha_cobro: hoy,
    });
    return this.findOne(id);
  }
}
