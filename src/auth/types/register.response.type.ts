import { Field, ObjectType } from '@nestjs/graphql';
import { ErrorType } from './error.type';
import { User } from 'src/user/user.model';

@ObjectType()
export class RegisterResponse {
  @Field(() => User, { nullable: true })
  user?: User;

  @Field(() => ErrorType, { nullable: true })
  error?: ErrorType;
}
