import { Module } from "@nestjs/common";
import { AccountsController } from "./accounts.controller";
import { AccountsService } from "./accounts.service";
import { User } from "../users/entities/users.entity";
import { UsersModule } from "../users/users.module";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Account } from "./entities/accounts.entity";
import { UsersService } from "../users/users.service";

@Module({
  imports: [TypeOrmModule.forFeature([Account, User]), UsersModule],
  controllers: [AccountsController],
  providers: [AccountsService, UsersService],
  exports: [AccountsService, UsersService],
})
export class AccountsModule {}
