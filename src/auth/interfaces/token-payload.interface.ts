import { UserRole } from '../../users/schemas/user.schema';

export interface TokenPayload {
  sub: string; // User ID
  username: string;
  roles: UserRole[];
} 