import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import { IsNull, Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const salt = bcrypt.genSaltSync();
    const password = bcrypt.hashSync(createUserDto.password ?? '', salt);
    const user = this.userRepository.create({ ...createUserDto, password });
    const saved = await this.userRepository.save(user);
    if (saved) {
      const { password: _, ...result } = saved;
      return result;
    }
    return null;
  }

  async findAll() {
    return await this.userRepository.find({
      where: { deletedAt: IsNull() },
      select: ['id', 'nombre', 'username', 'email', 'telefono', 'createdAt'],
    });
  }

  async findOne(id: number) {
    const user = await this.userRepository.findOne({
      where: { id },
      select: ['id', 'nombre', 'username', 'email', 'telefono', 'createdAt', 'updatedAt'],
    });
    return user ? user : null;
  }

  async findByUsername(username: string): Promise<UserEntity | null> {
    return await this.userRepository.findOne({ where: { username } });
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const data = { ...updateUserDto };
    if (data.password) {
      const salt = bcrypt.genSaltSync();
      data.password = bcrypt.hashSync(data.password, salt);
    }
    const result = await this.userRepository.update(id, data);
    return result.affected ? this.findOne(id) : null;
  }

  async remove(id: number) {
    const result = await this.userRepository.softDelete(id);
    return result.affected
      ? `Usuario con id ${id} ha sido eliminado`
      : `Usuario con id ${id} no encontrado`;
  }
}
