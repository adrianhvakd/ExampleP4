import { Controller, Param, Patch } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PagoEntity } from './entities/pago.entity';
import { Repository } from 'typeorm';

@Controller('pagos')
export class PagoController {
  constructor(
    @InjectRepository(PagoEntity)
    private pagoRepository: Repository<PagoEntity>,
  ) {}

  @Patch(':id/pagar')
  async pagar(@Param('id') id: string) {
    const hoy = new Date().toISOString().split('T')[0];
    await this.pagoRepository.update(id, {
      pagado: true,
      fecha_pago: hoy,
    });
    return await this.pagoRepository.findOne({
      where: { id },
      relations: ['ronda', 'member', 'member.user'],
    });
  }

  @Patch(':id/anular')
  async anular(@Param('id') id: string) {
    await this.pagoRepository.update(id, {
      pagado: false,
      fecha_pago: null as any,
    });
    return await this.pagoRepository.findOne({
      where: { id },
      relations: ['ronda', 'member', 'member.user'],
    });
  }
}
