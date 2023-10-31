import { BadRequestException } from '@nestjs/common';
import { Args, Context, Mutation, Resolver, Query } from '@nestjs/graphql';
import { Request, Response } from 'express';
import { LoginDTO, RegisterDTO } from 'src/auth/dto';
import { AuthService } from '../auth/auth.service';
import { LoginResponse, RegisterResponse } from '../auth/types';
import { UserService } from './user.service';

@Resolver()
export class UserResolver {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}

  // Mutation Register
  @Mutation(() => RegisterResponse)
  async register(
    @Args('registerInput') registerDTO: RegisterDTO,
    @Context() context: { res: Response },
  ): Promise<RegisterResponse> {
    try {
      if (registerDTO.password !== registerDTO.confirmPassword) {
        throw new BadRequestException('Passwords do not match.');
      }
      const user = await this.authService.register(registerDTO, context.res);
      return { user };
    } catch (error) {
      return {
        error: {
          message: error.message,
        },
      };
    }
  }

  // Mutation Login
  @Mutation(() => LoginResponse) // Adjust this return type as needed
  async login(
    @Args('loginInput') loginDto: LoginDTO,
    @Context() context: { res: Response },
  ) {
    try {
      return this.authService.login(loginDto, context.res);
    } catch (error) {
      return {
        error: {
          message: error.message,
        },
      };
    }
  }

  // Mutation Logout
  @Mutation(() => String)
  async logout(@Context() context: { res: Response }) {
    try {
      return this.authService.logout(context.res);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  //Mutation RefreshToken
  @Mutation(() => String)
  async refreshToken(@Context() context: { req: Request; res: Response }) {
    try {
      return this.authService.refreshToken(context.req, context.res);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Query(() => String)
  async hello() {
    return 'Hello World';
  }
}
