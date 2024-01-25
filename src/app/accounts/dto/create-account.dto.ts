import {
  IsNotEmpty,
  IsString,
  IsNumber,
  IsOptional,
  IsEnum,
} from "class-validator";

enum AccountStatus {
  ACTIVE = 1,
  INACTIVE = 2,
}

export class CreateAccountDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsNumber()
  current_balance: number;

  @IsNotEmpty()
  @IsNumber()
  @IsEnum(AccountStatus, {
    message: '"status" must be 1 (active) or 2 (inactive)',
  })
  status: number;

  @IsOptional()
  @IsString()
  icon?: string;
}
