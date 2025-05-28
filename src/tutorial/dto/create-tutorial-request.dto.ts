/* eslint-disable @typescript-eslint/no-unsafe-call */
import { IsString, IsUrl, IsNotEmpty } from 'class-validator';

export class CreateTutorialRequestDto {
  @IsString()
  @IsNotEmpty()
  title!: string;

  @IsString()
  @IsNotEmpty()
  description!: string;

  @IsUrl()
  url!: string;
}
