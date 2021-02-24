import "reflect-metadata";
import {
  Arg,
  Ctx,
  Field,
  Mutation,
  ObjectType,
  Query,
  Resolver,
} from "type-graphql";
import { User } from "./entity/User";
import { hash, compare } from "bcryptjs";
import { sign } from "jsonwebtoken";
import { MyContext } from "./MyContext";

@ObjectType()
class LoginResponce {
  @Field()
  accessToken: string;
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
    @Arg("password") password: string, // the ()=>String is not nessesary
    @Ctx() { res }: MyContext
  ): Promise<LoginResponce> {
    const user = await User.findOne({
      where: { email },
    });
    if (!user) {
      throw new Error("could not find user");
    }
    // dont forget the await..
    const valid = await compare(password, user.password);
    if (!valid) {
      throw new Error("Bad password");
    }
    //if user exists and creds are correct, return the accessToken

    res.cookie(
      "jid",
      sign({ userID: user.id }, "anothersecretiguess", { expiresIn: "7d" }),
      {
        httpOnly:true,
      
      }
    );
    return {
      accessToken: sign({ userID: user.id }, "secret", { expiresIn: "15m" }),
    };
  }
}
