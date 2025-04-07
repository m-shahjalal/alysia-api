import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { randomBytes } from 'crypto';
import { AppLogger } from 'src/global/logger/logger.service';
import { SignInDto } from './dtos/signin.dto';
import { UserService } from '../user/user.service';
import { MailService } from 'src/features/mail/mail.service';
import { UserAccessTokenClaims } from 'src/global/request/auth-response.dto';
import { AuthResponse } from './dtos/auth-response.dto';
import { VerifyEmailDto } from './dtos/verify-email.dto';
import { VerifyPhoneDto } from './dtos/verify-phone.dto';
import {
  RequestPasswordResetDto,
  ResetPasswordDto,
} from './dtos/reset-password.dto';
import { User } from '../user/user.entity';
import { JwtService } from '@nestjs/jwt';
import { SignUpDto } from './dtos/signup.dto';
import { AuthConfig } from 'src/config/config.utils';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly configService: ConfigService<AuthConfig>,
    private readonly emailService: MailService,
    private readonly logger: AppLogger,
    private readonly jwtService: JwtService,
  ) {
    this.logger.setContext(AuthService.name);
  }

  async validateUser(
    identifier: string,
    password: string,
  ): Promise<UserAccessTokenClaims> {
    const user = await this.userService.findByEmailOrPhone(identifier);
    const isPasswordValid = await this.userService.validatePassword(
      user,
      password,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return {
      id: user.id,
      email: user.email,
    };
  }

  async login(loginDto: SignInDto): Promise<AuthResponse> {
    if (!loginDto.username) {
      throw new BadRequestException('Email or phone is required');
    }

    const user = await this.validateUser(loginDto.username, loginDto.password);
    return this.generateTokens(user);
  }

  async register(registerDto: SignUpDto): Promise<AuthResponse> {
    try {
      this.logger.log('Starting user registration process');

      if (!registerDto.email && !registerDto.phone) {
        this.logger.error('Registration failed: Email or phone is required');
        throw new BadRequestException('Email or phone is required');
      }

      const user = await this.userService.create(registerDto);
      this.logger.log(`User created successfully with id: ${user.id}`);

      const payload: UserAccessTokenClaims = {
        id: user.id,
        email: user.email,
      };

      const tokens = this.generateTokens(payload);
      this.logger.log('Generated authentication tokens');

      return tokens;
    } catch (error) {
      this.logger.error(`Registration failed: ${error.message}`, error.stack);
      throw error;
    }
  }

  async verifyEmail(verifyEmailDto: VerifyEmailDto): Promise<void> {
    const user = await this.userService.findByVerificationToken(
      verifyEmailDto.token,
    );

    if (
      !user ||
      !user.verificationToken ||
      user.verificationTokenExpires < new Date()
    ) {
      throw new BadRequestException('Invalid or expired verification token');
    }

    user.isEmailVerified = true;
    user.verificationToken = null;
    user.verificationTokenExpires = null;
    await this.userService.save(user);
  }

  async verifyPhone(verifyPhoneDto: VerifyPhoneDto): Promise<void> {
    const user = await this.userService.findByPhone(verifyPhoneDto.phone);

    if (
      !user ||
      !user.phoneOtp ||
      user.phoneOtpExpires < new Date() ||
      user.phoneOtp !== verifyPhoneDto.otp
    ) {
      throw new BadRequestException('Invalid or expired OTP');
    }

    user.isPhoneVerified = true;
    user.phoneOtp = null;
    user.phoneOtpExpires = null;
    await this.userService.save(user);
  }

  async requestPasswordReset(dto: RequestPasswordResetDto): Promise<void> {
    const identifier = dto.username;
    if (!identifier) {
      throw new BadRequestException('Email or phone is required');
    }

    const user = await this.userService.findByEmailOrPhone(identifier);
    const token = this.generateVerificationToken();
    user.resetToken = token;
    user.resetTokenExpires = new Date(Date.now() + 1 * 60 * 60 * 1000); // 1 hour
    await this.userService.save(user);
    await this.emailService.sendPasswordResetEmail(user.email, token);
  }

  async resetPassword(resetPasswordDto: ResetPasswordDto): Promise<void> {
    const user = await this.userService.findByResetToken(
      resetPasswordDto.token,
    );

    if (!user || !user.resetToken || user.resetTokenExpires < new Date()) {
      throw new BadRequestException('Invalid or expired reset token');
    }

    user.password = resetPasswordDto.password;
    user.resetToken = null;
    user.resetTokenExpires = null;
    await this.userService.save(user);
  }

  async refreshToken(user: UserAccessTokenClaims): Promise<AuthResponse> {
    const freshUser = await this.userService.findById(user.id);
    if (!freshUser) {
      throw new UnauthorizedException('User not found');
    }

    const payload: UserAccessTokenClaims = {
      id: freshUser.id,
      email: freshUser.email,
    };
    return this.generateTokens(payload);
  }

  async getUserById(id: string): Promise<User> {
    return this.userService.findById(id);
  }

  private generateTokens(payload: UserAccessTokenClaims): AuthResponse {
    return {
      accessToken: this.jwtService.sign(payload as object),
      refreshToken: this.jwtService.sign(payload as object, {
        secret: this.configService.get('secret'),
        expiresIn: this.configService.get('expiresIn') || '7d',
      }),
    };
  }

  private generateVerificationToken(): string {
    return randomBytes(32).toString('hex');
  }
}
