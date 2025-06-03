/* eslint-disable @typescript-eslint/no-unsafe-call */
import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsUrl, IsDate } from 'class-validator';

export class TutorialResponseDto {
  @ApiProperty({ required: true, example: 'Tu primera compra' })
  @IsString()
  title!: string;

  @ApiProperty({ required: true, example: 'Descripción de ejemplo' })
  @IsString()
  description!: string;

  @ApiProperty({ required: true, example: 'www.example.com' })
  @IsUrl()
  url!: string;

  @ApiProperty({ required: true, example: new Date() })
  @IsDate()
  postedAt!: Date;
}
