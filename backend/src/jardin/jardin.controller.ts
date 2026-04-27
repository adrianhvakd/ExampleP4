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
import { JardinService } from './jardin.service';
import { CreateJardinDto } from './dto/create-jardin.dto';
import { UpdateJardinDto } from './dto/update-jardin.dto';

@Controller('jardin')
export class JardinController {
  constructor(private readonly jardinService: JardinService) {}

  @Post()
  create(@Body() createJardinDto: CreateJardinDto) {
    return this.jardinService.create(createJardinDto);
  }

  @Get()
  findAll(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    @Query('nombre') nombre?: string,
  ) {
    return this.jardinService.findPaginate(page, limit, nombre);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.jardinService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateJardinDto: UpdateJardinDto) {
    return this.jardinService.update(id, updateJardinDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.jardinService.remove(id);
  }
}
