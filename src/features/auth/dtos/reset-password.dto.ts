import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class RequestPasswordResetDto {
  @ApiProperty({ example: 'user@example.com', required: false })
  @IsString()
  @IsOptional()
  username?: string;
}

export class ResetPasswordDto {
  @ApiProperty({ example: 'reset-token-123' })
  token: string;

  @ApiProperty({ example: 'newPassword123' })
  password: string;
}
