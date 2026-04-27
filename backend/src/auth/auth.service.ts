import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private jwtService: JwtService,
  ) {}
  async singIn(username: string, password: string) {
    if (!password) throw new UnauthorizedException('Credenciales incorrectos');

    const user = await this.usersService.findByUsername(username);

    if (!user) throw new UnauthorizedException('Credenciales incorrectos');
    const comparePass = bcrypt.compareSync(password, user.password ?? '');
    if (!comparePass)
      throw new UnauthorizedException('Credenciales incorrectos');
    const payload = {
      id: user.id,
      nombre: user.nombre,
      username: user.username,
    };
    const token = this.jwtService.sign(payload);
    return {
      access_token: token,
      type: 'bearer',
    };
  }
}
