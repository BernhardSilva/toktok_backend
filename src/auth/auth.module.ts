import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma.service';
import { AuthService } from './auth.service';

@Module({
  providers: [AuthService, JwtService, ConfigService, PrismaService],
})
export class AuthModule {}
