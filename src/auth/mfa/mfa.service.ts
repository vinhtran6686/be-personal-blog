import { Injectable, BadRequestException } from '@nestjs/common';
import { UsersService } from '../../users/users.service';
import * as speakeasy from 'speakeasy';
import * as QRCode from 'qrcode';

@Injectable()
export class MfaService {
  constructor(private readonly usersService: UsersService) {}

  /**
   * Generate a secret for MFA setup
   */
  async generateSecret(user: any) {
    // Generate a secret using speakeasy
    const secret = speakeasy.generateSecret({
      length: 20,
      name: `Blog App:${user.email}`,
    });

    // Store temporary secret in user record
    await this.usersService.updateMfaSecret(user.id, secret.base32);

    // Generate QR code for the secret
    const qrCodeUrl = await QRCode.toDataURL(secret.otpauth_url);

    return {
      secret: secret.base32,
      qrCodeUrl,
    };
  }

  /**
   * Verify MFA token for authentication
   */
  async verifyToken(user: any, token: string): Promise<boolean> {
    // Get the user with secret from DB
    const userWithSecret = await this.usersService.findById(user._id || user.id);

    if (!userWithSecret || !userWithSecret.mfaSecret) {
      return false;
    }

    // Verify token against secret
    return speakeasy.totp.verify({
      secret: userWithSecret.mfaSecret,
      encoding: 'base32',
      token,
      window: 1, // Allow 1 time step drift (30 seconds before/after)
    });
  }

  /**
   * Verify token and enable MFA for user
   */
  async verifyAndEnableMfa(user: any, token: string) {
    const isValid = await this.verifyToken(user, token);

    if (!isValid) {
      throw new BadRequestException('Invalid MFA token');
    }

    // Enable MFA for the user
    await this.usersService.enableMfa(user.id);

    return { success: true };
  }

  /**
   * Disable MFA for user
   */
  async disableMfa(user: any) {
    await this.usersService.disableMfa(user.id);
    return { success: true };
  }
} 