import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { UserDocument, UserRole } from '../users/schemas/user.schema';
import { LoginDto } from './dto/login.dto';
import { TokenPayload } from './interfaces/token-payload.interface';
import { MfaService } from './mfa/mfa.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly mfaService: MfaService,
  ) {}

  /**
   * Validate user credentials for authentication
   */
  async validateUser(username: string, password: string): Promise<UserDocument | null> {
    const user = await this.usersService.findByUsername(username);
    
    if (user && await user.validatePassword(password)) {
      return user as UserDocument;
    }
    
    return null;
  }

  /**
   * Login user and return JWT tokens
   */
  async login(loginDto: LoginDto) {
    const { username, password, mfaToken } = loginDto;
    const user = await this.validateUser(username, password);
    
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Check if MFA is required for the user (enabled for admins)
    const isAdmin = user.roles.includes(UserRole.ADMIN);
    if (isAdmin && user.mfaEnabled) {
      // Verify MFA token if provided
      if (!mfaToken) {
        return { 
          requireMfa: true,
          message: 'MFA token required for admin login'
        };
      }
      
      const isValidToken = await this.mfaService.verifyToken(user, mfaToken);
      if (!isValidToken) {
        throw new UnauthorizedException('Invalid MFA token');
      }
    }

    // Generate tokens
    const { accessToken, refreshToken } = await this.generateTokens(user as UserDocument);

    return {
      user: {
        id: user._id?.toString() || '',
        username: user.username,
        email: user.email,
        roles: user.roles,
      },
      accessToken,
      refreshToken,
    };
  }

  /**
   * Refresh access token using a valid refresh token
   */
  async refreshToken(refreshToken: string) {
    try {
      // Verify the refresh token
      const payload = this.jwtService.verify(refreshToken, {
        secret: process.env.JWT_SECRET,
      });
      
      const user = await this.usersService.findById(payload.sub);
      
      if (!user) {
        throw new UnauthorizedException('Invalid refresh token');
      }
      
      // Generate new tokens
      const tokens = await this.generateTokens(user as UserDocument);
      
      return tokens;
    } catch (error) {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  /**
   * Generate JWT access and refresh tokens
   */
  private async generateTokens(user: UserDocument) {
    const payload: TokenPayload = { 
      sub: user._id?.toString() || '',
      username: user.username,
      roles: user.roles
    };
    
    // Create tokens with different expiration times
    const accessToken = this.jwtService.sign(payload);
    const refreshToken = this.jwtService.sign(payload, {
      expiresIn: '7d', // longer expiration for refresh token
    });
    
    return {
      accessToken,
      refreshToken,
    };
  }
} 