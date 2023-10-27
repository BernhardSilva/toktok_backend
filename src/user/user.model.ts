import { Field, ObjectType } from '@nestjs/graphql';
import internal from 'stream';

@ObjectType()
export class User {
  @Field()
  id?: number;

  @Field()
  fullname: string;

  @Field()
  username: string;

  @Field()
  email?: string;

  @Field({ nullable: true })
  bio?: string;

  @Field({ nullable: true })
  image: string;

  @Field()
  password: string;

  @Field()
  createdAt?: Date;

  @Field()
  updatedAt?: Date;

  @Field()
  following?: number[];
}
