import { Field, InputType } from '@nestjs/graphql';
import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';

@InputType()
export class LoginDTO {
  @Field({ nullable: true })
  @IsOptional()
  @IsEmail({}, { message: 'Email must be a valid email' })
  email?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString({ message: 'Username must be a string' })
  username?: string;

  @Field()
  @IsNotEmpty({ message: 'Password is required' })
  password: string;
}
