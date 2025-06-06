import { IsEmail, IsString } from '@nestjs/class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UserResponseDto {
  @ApiProperty({ required: true, example: 'Eloy' })
  @IsString()
  name: string;

  @ApiProperty({ required: false, example: 'Pardo' })
  @IsString()
  surname?: string;

  @ApiProperty({ required: true, example: 'example@gmail.com' })
  @IsEmail()
  email: string;
}
