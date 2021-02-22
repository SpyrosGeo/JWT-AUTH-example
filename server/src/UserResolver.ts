import "reflect-metadata";
import { Arg, Field, Mutation, ObjectType, Query, Resolver } from "type-graphql";
import { User } from "./entity/User";
import { hash,compare } from "bcryptjs";
@ObjectType()
class LoginResponce {
    @Field()
    accessToken:string
}
//extend resolvers
@Resolver()
export class UserResolver {
  @Query(() => String)
  hello() {
    return "fuck off dude ";
  }
  @Query(() => [User])
  users() {
    return User.find();
  }
  @Mutation(() => Boolean)
  async register(
    //'email is what user passes|email is the variable and its type is string'
    @Arg("email", () => String) email: string,
    @Arg("password") password: string // the ()=>String is not nessesary
  ) {
    const hashedPassword = await hash(password, 12);
    try {
      await User.insert({
        email,
        password: hashedPassword,
      });
    } catch (error) {
      console.log(error);
      return false;
    }
    return true;
  }

  @Mutation(() => LoginResponce)
  async login(
    //'email is what user passes|email is the variable and its type is string'
    @Arg("email", () => String) email: string,
    @Arg("password") password: string // the ()=>String is not nessesary
  ):Promise<LoginResponce> {
    const user = await User.findOne({
      where: { email },
    });
    if(!user){
        throw new Error("could not find user")
    }
    const valid = compare(password,user.password)
    if (!valid ){
        throw new Error("Bad password")
    }
    //if user exists and creds are correct, return the accessToken
        return {
            accessToken:''
        };
  }
}
