import "reflect-metadata"
import {Query, Resolver } from 'type-graphql'


//extend resolvers
@Resolver()
export class UserResolver {

    @Query(()=> String)
    hello(){
        return "fuck off"
    }
}
