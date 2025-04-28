//import nest swagger
//import class-validator
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
  @IsPassword()
  password: string;
}
