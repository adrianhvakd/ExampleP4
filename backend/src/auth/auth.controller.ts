import {
  Body,
  Controller,
  Get,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from './auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async signIn(@Body() datos: { username: string; password: string }) {
    return await this.authService.singIn(datos.username, datos.password);
  }

  @UseGuards(AuthGuard)
  @Get('profile')
  async getProfile(@Request() req: { user: { id: number } }) {
    return await this.authService.getProfile(req.user.id);
  }
}
