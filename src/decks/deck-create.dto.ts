import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateDeckDto {
  @IsString()
  @IsNotEmpty({ message: 'Title cannot be empty' })
  title: string;

  @IsOptional()
  @IsString()
  image?: string;
}
