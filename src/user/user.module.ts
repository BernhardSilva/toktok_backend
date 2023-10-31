import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserResolver } from './user.resolver';
import { AuthService } from 'src/auth/auth.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from 'src/prisma.service';

@Module({
  providers: [
    UserService,
    UserResolver,
    AuthService,
    JwtService,
    ConfigService,
    PrismaService,
  ],
})
export class UserModule {}
