import { verify } from "jsonwebtoken";
import { MiddlewareFn } from "type-graphql/dist/interfaces/Middleware";
import { MyContext } from "./MyContext";

//bearer 10201023023...
export const isAuth: MiddlewareFn<MyContext> = ({ context }, next) => {
  const authrization = context.req.headers["authorization"];
  if (!authrization) {
    throw new Error("not authenticated");
  }
  try {
    const token = authrization.split(" ")[1];
    const payload = verify(token, process.env.ACCESS_TOKEN_SECRET!);
    context.payload = payload as any;
  } catch (error) {
    console.log(error);
    throw new Error("Not Authenticated");
  }
  return next();
};
