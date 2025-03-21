import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './schemas/user.schema';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    // Check if user with the same email or username already exists
    const { email, username } = createUserDto;
    const existingUser = await this.userModel.findOne({
      $or: [{ email }, { username }],
    });
    
    if (existingUser) {
      if (existingUser.email === email) {
        throw new ConflictException('Email already in use');
      }
      if (existingUser.username === username) {
        throw new ConflictException('Username already taken');
      }
    }

    const createdUser = new this.userModel(createUserDto);
    return createdUser.save();
  }

  async findAll(): Promise<User[]> {
    return this.userModel.find().exec();
  }

  async findById(id: string): Promise<UserDocument | null> {
    const user = await this.userModel.findById(id).exec();
    if (!user) {
      throw new NotFoundException(`User with ID "${id}" not found`);
    }
    return user as UserDocument;
  }

  async findByEmail(email: string): Promise<UserDocument | null> {
    return this.userModel.findOne({ email }).exec() as Promise<UserDocument | null>;
  }

  async findByUsername(username: string): Promise<UserDocument | null> {
    return this.userModel.findOne({ username }).exec() as Promise<UserDocument | null>;
  }

  async update(id: string, updateData: Partial<User>): Promise<User> {
    // Ensure password is not included in the update
    if (updateData.password) {
      delete updateData.password;
    }

    const updatedUser = await this.userModel
      .findByIdAndUpdate(id, updateData, { new: true })
      .exec();
    
    if (!updatedUser) {
      throw new NotFoundException(`User with ID "${id}" not found`);
    }
    
    return updatedUser;
  }

  async remove(id: string): Promise<void> {
    const result = await this.userModel.deleteOne({ _id: id }).exec();
    if (result.deletedCount === 0) {
      throw new NotFoundException(`User with ID "${id}" not found`);
    }
  }

  /**
   * Store temporary MFA secret for user
   */
  async updateMfaSecret(id: string, secret: string): Promise<User> {
    return this.update(id, { mfaSecret: secret });
  }

  /**
   * Enable MFA for user
   */
  async enableMfa(id: string): Promise<User> {
    return this.update(id, { mfaEnabled: true });
  }

  /**
   * Disable MFA for user
   */
  async disableMfa(id: string): Promise<User> {
    return this.update(id, { mfaEnabled: false, mfaSecret: undefined });
  }
} 