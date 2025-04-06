import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { AuthResponse } from './dtos/auth-response.dto';
import { SignInDto } from './dtos/signin.dto';
import { SignUpDto } from './dtos/signup.dto';
import { VerifyEmailDto } from './dtos/verify-email.dto';
import { VerifyPhoneDto } from './dtos/verify-phone.dto';
import {
  RequestPasswordResetDto,
  ResetPasswordDto,
} from './dtos/reset-password.dto';
import { JwtAuthGuard } from 'src/global/guards/jwt-auth.guard';
import { UserAccessTokenClaims } from 'src/global/request/auth-token-output.dto';
import { User } from '../user/user.entity';
import { JwtRefreshGuard } from 'src/global/guards/jwt-refresh.guard';
import { GetUser } from './decorators/get-user.decorator';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'User login' })
  @ApiResponse({ status: HttpStatus.OK, type: AuthResponse })
  async login(@Body() loginDto: SignInDto): Promise<AuthResponse> {
    return this.authService.login(loginDto);
  }

  @Post('register')
  @ApiOperation({ summary: 'User registration' })
  @ApiResponse({ status: HttpStatus.CREATED, type: AuthResponse })
  async register(@Body() registerDto: SignUpDto): Promise<AuthResponse> {
    return this.authService.register(registerDto);
  }

  @Post('verify-email')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Verify email address' })
  @ApiResponse({ status: HttpStatus.OK })
  async verifyEmail(@Body() verifyEmailDto: VerifyEmailDto): Promise<void> {
    await this.authService.verifyEmail(verifyEmailDto);
  }

  @Post('verify-phone')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Verify phone number' })
  @ApiResponse({ status: HttpStatus.OK })
  async verifyPhone(@Body() verifyPhoneDto: VerifyPhoneDto): Promise<void> {
    await this.authService.verifyPhone(verifyPhoneDto);
  }

  @Post('request-password-reset')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Request password reset' })
  @ApiResponse({ status: HttpStatus.OK })
  async requestPasswordReset(
    @Body() dto: RequestPasswordResetDto,
  ): Promise<void> {
    await this.authService.requestPasswordReset(dto);
  }

  @Post('reset-password')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Reset password' })
  @ApiResponse({ status: HttpStatus.OK })
  async resetPassword(
    @Body() resetPasswordDto: ResetPasswordDto,
  ): Promise<void> {
    await this.authService.resetPassword(resetPasswordDto);
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get current user' })
  @ApiResponse({ status: HttpStatus.OK, type: User })
  async me(@GetUser() user: UserAccessTokenClaims): Promise<User> {
    return this.authService.getUserById(user.id);
  }

  @Post('refresh')
  @UseGuards(JwtRefreshGuard)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Refresh access token' })
  @ApiResponse({ status: HttpStatus.OK, type: AuthResponse })
  async refreshToken(
    @GetUser() user: UserAccessTokenClaims,
  ): Promise<AuthResponse> {
    return this.authService.refreshToken(user);
  }
}
