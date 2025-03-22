import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as bcrypt from 'bcrypt';

export enum UserRole {
  USER = 'user',
  ADMIN = 'admin',
  EDITOR = 'editor',
}

export type UserDocument = User & Document;

@Schema({
  timestamps: true,
  toJSON: {
    transform: (doc, ret) => {
      delete ret.password;
      delete ret.mfaSecret; // Don't expose MFA secret in responses
      return ret;
    },
  },
})
export class User {
  @Prop({ required: true, unique: true })
  username: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ type: [String], enum: UserRole, default: [UserRole.USER] })
  roles: UserRole[];

  @Prop({ type: Object, default: {} })
  profile: {
    firstName?: string;
    lastName?: string;
    bio?: string;
    avatarUrl?: string;
  };

  @Prop({ default: false })
  isEmailVerified: boolean;

  // MFA related properties
  @Prop({ default: false })
  mfaEnabled: boolean;

  @Prop({ type: String, required: false })
  mfaSecret: string;

  async validatePassword(password: string): Promise<boolean> {
    return bcrypt.compare(password, this.password);
  }
}

export const UserSchema = SchemaFactory.createForClass(User);

// Add pre-save hook to hash password before saving
UserSchema.pre('save', async function(next) {
  const user = this as UserDocument;
  
  // Only hash the password if it has been modified or is new
  if (!user.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);
    next();
  } catch (error) {
    next(error);
  }
}); 