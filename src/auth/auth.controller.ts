import { Body, Controller, Get, Post, UseGuards, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { RolesGuard } from './guards/roles.guard';
import { Roles } from './decorators/roles.decorator';
import { UserRole } from '../users/schemas/user.schema';
import { MfaService } from './mfa/mfa.service';
import { Request } from 'express';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly mfaService: MfaService,
  ) {}

  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Post('refresh')
  async refreshToken(@Body() refreshTokenDto: RefreshTokenDto) {
    return this.authService.refreshToken(refreshTokenDto.refreshToken);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Req() req: Request) {
    return req.user;
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Get('admin')
  getAdminData() {
    return { message: 'This is protected admin data' };
  }

  @UseGuards(JwtAuthGuard)
  @Post('mfa/setup')
  async setupMfa(@Req() req: Request) {
    const user = req.user;
    return this.mfaService.generateSecret(user);
  }

  @UseGuards(JwtAuthGuard)
  @Post('mfa/verify')
  async verifyMfa(@Req() req: Request, @Body('token') token: string) {
    const user = req.user;
    return this.mfaService.verifyAndEnableMfa(user, token);
  }

  @UseGuards(JwtAuthGuard)
  @Post('mfa/disable')
  async disableMfa(@Req() req: Request) {
    const user = req.user;
    return this.mfaService.disableMfa(user);
  }
} 