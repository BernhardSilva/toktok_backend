import {
  Injectable,
  UnauthorizedException,
  NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma.service';
import * as bcrypt from 'bcrypt';
import { Response, Request } from 'express';
import { User } from '@prisma/client';
import { ConfigService } from '@nestjs/config';
import { LoginDTO, RegisterDTO } from './dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async refreshToken(req: Request, res: Response): Promise<string> {
    const refreshToken = req.cookies['refresh_token'];
    if (!refreshToken) {
      throw new UnauthorizedException('Refresh token not found');
    }

    let payload;
    try {
      payload = this.jwtService.verify(refreshToken, {
        secret: this.configService.get<string>('JWT_REFRESH_TOKEN_SECRET'),
      });
    } catch (error) {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }

    const userExists = await this.prisma.user.findUnique({
      where: {
        id: payload.sub,
      },
    });
    if (!userExists) {
      throw new NotFoundException('User no longer exists');
    }
    const expiresIn = 15000;
    const expiration = Math.floor(Date.now() / 1000) + expiresIn;
    const accessToken = this.jwtService.sign(
      {
        ...payload,
        exp: expiration,
      },
      {
        secret: this.configService.get<string>('JWT_ACCESS_TOKEN_SECRET'),
      },
    );

    res.cookie('access_token', accessToken, { httpOnly: true });

    return accessToken;
  }

  private async issueTokens(user: User, response: Response) {
    const payload = { username: user.fullname, sub: user.id };

    const accessToken = this.jwtService.sign(
      { ...payload },
      {
        secret: this.configService.get<string>('JWT_ACCESS_TOKEN_SECRET'),
        expiresIn: '15m',
      },
    );

    const refreshToken = this.jwtService.sign(payload, {
      secret: this.configService.get<string>('JWT_REFRESH_TOKEN_SECRET'),
      expiresIn: '7d',
    });

    response.cookie('refresh_token', refreshToken, { httpOnly: true });
    response.cookie('access_token', accessToken, { httpOnly: true });
    return user;
  }

  async validateUser(loginDTO: LoginDTO) {
    const { email, username, password } = loginDTO;

    const user = await this.prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (!user) {
      await this.prisma.user.findUnique({
        where: {
          username,
        },
      });
    }

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return user;
  }

  async register(RegisterDTO: RegisterDTO, response: Response) {
    const { email, fullname, username, password } = RegisterDTO;
    const existingUser = await this.prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw new UnauthorizedException('Email already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await this.prisma.user.create({
      data: {
        fullname,
        username,
        password: hashedPassword,
        email,
      },
    });

    return this.issueTokens(user, response);
  }

  async login(LoginDTO: LoginDTO, response: Response) {
    const user = await this.validateUser(LoginDTO);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    return this.issueTokens(user, response);
  }

  async logout(response: Response) {
    response.clearCookie('refresh_token');
    response.clearCookie('access_token');
    return {
      message: 'Logged out successfully',
    };
  }
}
