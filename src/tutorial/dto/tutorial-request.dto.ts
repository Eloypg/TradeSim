/* eslint-disable @typescript-eslint/no-unsafe-call */
import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsUrl, IsNotEmpty } from 'class-validator';

export class TutorialRequestDto {
  @ApiProperty({ required: true, example: 'Tu primera compra' })
  @IsString()
  @IsNotEmpty()
  title!: string;

  @ApiProperty({ required: true, example: 'Descripción de ejemplo' })
  @IsString()
  @IsNotEmpty()
  description!: string;

  @ApiProperty({ required: true, example: 'www.example.com' })
  @IsUrl()
  url!: string;
}
