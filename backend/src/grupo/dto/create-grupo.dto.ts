import { IsArray, IsDateString, IsNotEmpty, IsNumber, IsOptional, IsString, Min, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class MiembroDto {
  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  userId?: number;

  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  @Type(() => Number)
  orden?: number;
}

export class CreateGrupoDto {
  @IsString()
  @IsNotEmpty()
  nombre?: string;

  @IsString()
  @IsOptional()
  descripcion?: string;

  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  @Type(() => Number)
  monto_cuota?: number;

  @IsDateString()
  @IsNotEmpty()
  fecha_inicio?: string;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => MiembroDto)
  miembros?: MiembroDto[];
}
