import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { CreateGrupoDto } from './dto/create-grupo.dto';
import { UpdateGrupoDto } from './dto/update-grupo.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { GrupoEntity, EstadoGrupo } from './entities/grupo.entity';
import { GroupMemberEntity, EstadoMiembro } from './entities/group-member.entity';
import { RondaEntity, EstadoRonda } from './entities/ronda.entity';
import { PagoEntity } from './entities/pago.entity';
import { IsNull, Like, Repository } from 'typeorm';

@Injectable()
export class GrupoService {
  constructor(
    @InjectRepository(GrupoEntity)
    private grupoRepository: Repository<GrupoEntity>,
    @InjectRepository(GroupMemberEntity)
    private memberRepository: Repository<GroupMemberEntity>,
    @InjectRepository(RondaEntity)
    private rondaRepository: Repository<RondaEntity>,
    @InjectRepository(PagoEntity)
    private pagoRepository: Repository<PagoEntity>,
  ) {}

  async create(createGrupoDto: CreateGrupoDto, userId: number) {
    const { miembros, ...grupoData } = createGrupoDto;

    const grupo = this.grupoRepository.create({
      ...grupoData,
      createdById: userId,
    });
    const savedGrupo = await this.grupoRepository.save(grupo);

    if (miembros && miembros.length > 0) {
      await this.generateRondas(savedGrupo.id, miembros as { userId: number; orden: number }[], grupoData.fecha_inicio!, Number(grupoData.monto_cuota));
    }

    return await this.findOne(savedGrupo.id!);
  }

  private async generateRondas(
    grupoId: string,
    miembros: { userId: number; orden: number }[],
    fechaInicio: string,
    montoCuota: number,
  ) {
    const memberEntities = miembros.map(m =>
      this.memberRepository.create({
        grupoId,
        userId: m.userId,
        orden: m.orden,
      }),
    );
    const savedMembers = await this.memberRepository.save(memberEntities);

    const memberCount = savedMembers.length;
    const montoTotal = montoCuota;
    const cuotaIndividual = montoCuota / memberCount;
    const fechaInicioDate = new Date(fechaInicio);

    const rondaEntities = savedMembers.map((member, index) => {
      const fecha = new Date(fechaInicioDate);
      fecha.setDate(fecha.getDate() + index * 30);
      return this.rondaRepository.create({
        grupoId,
        numero: index + 1,
        beneficiarioMemberId: member.id,
        monto_total: montoTotal,
        cuota_individual: cuotaIndividual,
        fecha_programada: fecha.toISOString().split('T')[0],
      });
    });
    const savedRondas = await this.rondaRepository.save(rondaEntities);

    const pagoEntities: PagoEntity[] = [];
    for (const ronda of savedRondas) {
      for (const member of savedMembers) {
        pagoEntities.push(
          this.pagoRepository.create({
            rondaId: ronda.id,
            memberId: member.id,
          }),
        );
      }
    }
    await this.pagoRepository.save(pagoEntities);
  }

  async addMember(grupoId: string, userId: number, orden: number) {
    const grupo = await this.grupoRepository.findOne({ where: { id: grupoId } });
    if (!grupo) throw new NotFoundException(`Grupo con id ${grupoId} no encontrado`);

    const existing = await this.memberRepository.findOne({ where: { grupoId, userId } });
    if (existing) throw new BadRequestException('El usuario ya es miembro de este grupo');

    const member = this.memberRepository.create({ grupoId, userId, orden });
    const savedMember = await this.memberRepository.save(member);

    const rondas = await this.rondaRepository.find({ where: { grupoId }, order: { numero: 'ASC' } });

    if (rondas.length === 0) {
      const miembros = await this.memberRepository.find({ where: { grupoId }, order: { orden: 'ASC' } });
      const miembrosData = miembros.map(m => ({ userId: m.userId!, orden: m.orden! }));
      await this.generateRondas(
        grupoId,
        miembrosData,
        grupo.fecha_inicio!,
        Number(grupo.monto_cuota),
      );
    } else {
      const allMembers = await this.memberRepository.find({ where: { grupoId }, order: { orden: 'ASC' } });
      const totalMembers = allMembers.length;

      const pagoEntities = rondas.map(ronda =>
        this.pagoRepository.create({
          rondaId: ronda.id,
          memberId: savedMember.id,
        }),
      );
      await this.pagoRepository.save(pagoEntities);

      const ultimaRonda = rondas[rondas.length - 1];
      const nuevaFecha = new Date(ultimaRonda.fecha_programada!);
      nuevaFecha.setDate(nuevaFecha.getDate() + 30);

      const nuevaRonda = this.rondaRepository.create({
        grupoId,
        numero: rondas.length + 1,
        beneficiarioMemberId: savedMember.id,
        monto_total: Number(grupo.monto_cuota),
        cuota_individual: Number(grupo.monto_cuota) / totalMembers,
        fecha_programada: nuevaFecha.toISOString().split('T')[0],
      });
      const savedRonda = await this.rondaRepository.save(nuevaRonda);

      const nuevosPagos = allMembers.map(m =>
        this.pagoRepository.create({
          rondaId: savedRonda.id,
          memberId: m.id,
        }),
      );
      await this.pagoRepository.save(nuevosPagos);
    }

    return await this.findOne(grupoId);
  }

  async findPaginate(page = 1, limit = 10, nombre?: string) {
    const [data, total] = await this.grupoRepository.findAndCount({
      skip: (page - 1) * limit,
      take: limit,
      order: { createdAt: 'DESC' },
      where: {
        deletedAt: IsNull(),
        nombre: nombre ? Like(`%${nombre}%`) : undefined,
      },
      relations: ['createdBy', 'miembros', 'miembros.user'],
    });
    return {
      data,
      total,
      page,
      limit,
      lastPage: Math.ceil(total / limit),
    };
  }

  async findOne(id: string) {
    const result = await this.grupoRepository.findOne({
      where: { id },
      relations: [
        'createdBy',
        'miembros',
        'miembros.user',
        'rondas',
        'rondas.beneficiarioMember',
        'rondas.beneficiarioMember.user',
        'rondas.pagos',
        'rondas.pagos.member',
        'rondas.pagos.member.user',
      ],
    });
    if (!result) throw new NotFoundException(`Grupo con id ${id} no encontrado`);
    if (result.rondas) {
      result.rondas.sort((a, b) => (a.numero ?? 0) - (b.numero ?? 0));
    }
    return result;
  }

  async update(id: string, updateGrupoDto: UpdateGrupoDto) {
    const { miembros, ...data } = updateGrupoDto;
    const result = await this.grupoRepository.update(id, data);
    return result.affected ? this.findOne(id) : null;
  }

  async remove(id: string) {
    const result = await this.grupoRepository.softDelete(id);
    return result.affected
      ? `Grupo con id ${id} ha sido eliminado`
      : `Grupo con id ${id} no encontrado`;
  }

  async getDeudores() {
    const deudas = await this.pagoRepository.find({
      where: { pagado: false },
      relations: [
        'ronda',
        'ronda.grupo',
        'member',
        'member.user',
      ],
      order: { createdAt: 'DESC' },
    });

    const grouped = new Map<string, {
      grupo: any;
      deudores: any[];
    }>();

    for (const pago of deudas) {
      const ronda = pago.ronda!;
      const grupo = ronda.grupo!;
      const key = grupo.id!;

      if (!grouped.has(key)) {
        grouped.set(key, { grupo, deudores: [] });
      }

      grouped.get(key)!.deudores.push({
        id: pago.id,
        rondaId: ronda.id,
        rondaNumero: ronda.numero,
        fechaProgramada: ronda.fecha_programada,
        miembro: pago.member?.user?.nombre ?? 'Desconocido',
        miembroId: pago.memberId,
        monto: ronda.cuota_individual ?? 0,
      });
    }

    return Array.from(grouped.values());
  }
}
