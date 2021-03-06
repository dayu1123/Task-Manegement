import { EntityRepository, Repository } from "typeorm";
import { ConflictException, InternalServerErrorException } from "@nestjs/common";
import * as bcrypt from 'bcrypt';
import { User } from "./user.entity";
import { AuthCredentialsDto } from "./dto/auth-credentials.dto";

@EntityRepository(User)
export class UserRepository extends Repository<User> {
  async signUp(authCredentialsDto: AuthCredentialsDto): Promise<void> {
    const { username, password } = authCredentialsDto;


    const user = new User();
    user.username = username
    user.salt = await bcrypt.genSalt()
    user.password = await this.hashPasword(password, user.salt)

    console.log(user.password)
    try{
      await user.save()
    }
    catch(error) {
      if(error.code === '23505'){
         throw new ConflictException('Username already exist')
      }
      else {
        throw new InternalServerErrorException()
      }
    }
  }
  async validatePassword(authCredentialsDto: AuthCredentialsDto): Promise<string> {
    const {username, password} = authCredentialsDto;
    const user = await this.findOne({username})
    if(user && await user.validatePassword(password)){
      return user.username
    }
    else {
      return null
    }
  }
  private async hashPasword(password: string, salt: string) {
    return bcrypt.hash(password, salt)
  }
}