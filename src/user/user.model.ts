import { Field, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class User {
  @Field()
  id?: number;

  @Field()
  fullname: string;

  @Field()
  username: string;

  @Field()
  email: string;

  @Field({ nullable: true })
  bio?: string;

  @Field({ nullable: true })
  image: string;

  @Field(() => Int)
  following: number[];

  @Field(() => Int)
  followers: number[];

  @Field()
  password: string;

  @Field()
  createdAt?: Date;

  @Field()
  updatedAt?: Date;
}
