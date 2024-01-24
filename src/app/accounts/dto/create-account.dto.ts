import { IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";
export class CreateAccountDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsNumber()
  current_balance: number;

  @IsNotEmpty()
  @IsNumber()
  status: number;

  @IsOptional()
  @IsString()
  icon: string;
}
