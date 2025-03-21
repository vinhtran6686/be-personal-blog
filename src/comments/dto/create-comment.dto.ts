import { IsNotEmpty, IsString, IsOptional, IsEmail, IsMongoId, MinLength, MaxLength } from 'class-validator';

export class CreateCommentDto {
  @IsNotEmpty()
  @IsMongoId()
  post: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(2)
  @MaxLength(1000)
  content: string;

  @IsOptional()
  @IsMongoId()
  parentComment?: string;

  // Fields for guest users
  @IsOptional()
  @IsString()
  @MinLength(2)
  @MaxLength(50)
  guestName?: string;

  @IsOptional()
  @IsEmail()
  guestEmail?: string;
} 