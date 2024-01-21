import { IsString, IsEmail, Matches } from "class-validator";
import { MessageHelper } from "src/helpers/message.helper";
import { RegexHelper } from "src/helpers/regex.helper";

export class CreateUserDto {
  @IsString()
  name: string;

  @IsEmail()
  email: string;

  @IsString()
  @Matches(RegexHelper.password, {
    message: MessageHelper.PASSWORD_INVALID,
  })
  password: string;
}
