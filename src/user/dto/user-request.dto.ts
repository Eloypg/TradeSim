import { IsEmail, IsString } from '@nestjs/class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UserRequestDto {
  @ApiProperty({ required: true, example: 'Eloy' })
  @IsString()
  name: string;

  @ApiProperty({ required: false, example: 'Pardo' })
  @IsString()
  surname?: string;

  @ApiProperty({ required: true, example: 'example@gmail.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ required: true, example: 1234567890 })
  @IsString()
  password: string;
}
