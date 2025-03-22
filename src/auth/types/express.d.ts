import { UserRole } from '../../users/schemas/user.schema';

// Extending Express Request to include the user property added by Passport
declare global {
  namespace Express {
    // eslint-disable-next-line @typescript-eslint/no-empty-interface
    interface User {
      id: string;
      username: string;
      email: string;
      roles: UserRole[];
    }
  }
} 