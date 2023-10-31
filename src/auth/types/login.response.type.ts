import { Field, ObjectType } from '@nestjs/graphql';
import { User } from 'src/user/user.model';
import { ErrorType } from './error.type';

@ObjectType()
export class LoginResponse {
  @Field(() => User, { nullable: true })
  user?: User;

  @Field(() => ErrorType, { nullable: true })
  error?: ErrorType;
}
