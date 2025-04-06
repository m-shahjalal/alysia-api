import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, MinLength } from 'class-validator';

export class SignInDto {
  @ApiProperty({ example: 'test@mail.com', required: false })
  @IsString()
  @IsOptional()
  username?: string;

  @ApiProperty({ example: 'pass@123' })
  @IsString()
  @MinLength(8)
  password: string;
}
