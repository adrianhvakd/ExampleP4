import { Module } from '@nestjs/common';
import { JardinService } from './jardin.service';
import { JardinController } from './jardin.controller';
import { JardinEntity } from './entities/jardin.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([JardinEntity])],
  controllers: [JardinController],
  providers: [JardinService],
})
export class JardinModule {}
