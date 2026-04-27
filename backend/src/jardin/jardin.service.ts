import { Injectable } from '@nestjs/common';
import { CreateJardinDto } from './dto/create-jardin.dto';
import { UpdateJardinDto } from './dto/update-jardin.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { JardinEntity } from './entities/jardin.entity';
import { IsNull, Like, Repository } from 'typeorm';

@Injectable()
export class JardinService {
  constructor(
    @InjectRepository(JardinEntity)
    private jardinRepository: Repository<JardinEntity>,
  ) {}

  async create(createJardinDto: CreateJardinDto) {
    const result = this.jardinRepository.create(createJardinDto);
    const saved = await this.jardinRepository.save(result);
    return saved ? saved : null;
  }

  async findPaginate(page = 1, limit = 10, nombre?: string) {
    const [data, total] = await this.jardinRepository.findAndCount({
      skip: (page - 1) * limit,
      take: limit,
      order: { createdAt: 'DESC' },
      where: {
        deletedAt: IsNull(),
        nombre: nombre ? Like(`%${nombre}%`) : undefined,
      },
    });
    return {
      data,
      total,
      page,
      limit,
      lastPage: Math.ceil(total / limit),
    };
  }

  async findAll() {
    const result = await this.jardinRepository.find({
      where: { deletedAt: IsNull() },
    });
    return result;
  }

  async findOne(id: string) {
    const result = await this.jardinRepository.findOneBy({ id });
    return result ? result : null;
  }

  async update(id: string, updateJardinDto: UpdateJardinDto) {
    const result = await this.jardinRepository.update(id, updateJardinDto);
    return result.affected ? this.findOne(id) : null;
  }

  async remove(id: string) {
    const result = await this.jardinRepository.softDelete(id);
    return result.affected
      ? `Jardin con id ${id} ha sido eliminado`
      : `Jardin con id ${id} no encontrado`;
  }
}
