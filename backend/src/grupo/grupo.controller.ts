import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { GrupoService } from './grupo.service';
import { CreateGrupoDto } from './dto/create-grupo.dto';
import { UpdateGrupoDto } from './dto/update-grupo.dto';

@Controller('grupos')
export class GrupoController {
  constructor(private readonly grupoService: GrupoService) {}

  @Post()
  create(@Body() createGrupoDto: CreateGrupoDto) {
    const userId = 1;
    return this.grupoService.create(createGrupoDto, userId);
  }

  @Get()
  findAll(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    @Query('nombre') nombre?: string,
  ) {
    return this.grupoService.findPaginate(page, limit, nombre);
  }

  @Get('deudores')
  getDeudores() {
    return this.grupoService.getDeudores();
  }

  @Post(':id/miembros')
  addMember(
    @Param('id') id: string,
    @Body() body: { userId: number; orden: number },
  ) {
    return this.grupoService.addMember(id, body.userId, body.orden);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.grupoService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateGrupoDto: UpdateGrupoDto) {
    return this.grupoService.update(id, updateGrupoDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.grupoService.remove(id);
  }
}
