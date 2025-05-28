/* eslint-disable @typescript-eslint/no-unsafe-call */
import { IsUUID, IsString, IsUrl, IsDate } from 'class-validator';

export class TutorialResponseDto {
  @IsUUID()
  tutorialId!: string;

  @IsString()
  title!: string;

  @IsString()
  description!: string;

  @IsUrl()
  url!: string;

  @IsDate()
  postedAt!: Date;
}
