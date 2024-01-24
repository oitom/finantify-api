import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import { Account } from "./entities/accounts.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { CreateAccountDto } from "./dto/create-account.dto";
import { REQUEST } from "@nestjs/core";
import { Request } from "express";
import { UsersService } from "../users/users.service";

@Injectable()
export class AccountsService {
  constructor(
    @InjectRepository(Account)
    private readonly accountRepository: Repository<Account>,
    private readonly usersService: UsersService,
    @Inject(REQUEST) private readonly request: Request,
  ) {}

  private selectFields = [
    "id",
    "name",
    "icon",
    "status",
    "user",
    "created_at",
    "updated_at",
  ];

  async findAll(): Promise<Account[]> {
    return this.accountRepository.find({
      select: this.selectFields as (keyof Account)[],
    });
  }

  async findOne(id: string): Promise<Account> {
    const account = await this.accountRepository.findOne({
      where: { id },
      select: this.selectFields as (keyof Account)[],
    });

    if (!account) {
      throw new NotFoundException("Account not found");
    }

    return account;
  }

  async create(data: CreateAccountDto): Promise<Account> {
    const userToken = this.request.user as any;
    if (!userToken) {
      throw new NotFoundException("User not found");
    }

    const user = await this.usersService.findOne(userToken.id);

    const newAccount = new Account();
    newAccount.name = data.name;
    newAccount.current_balance = data.current_balance;
    newAccount.status = data.status;
    newAccount.icon = data.icon;
    newAccount.user = user;
    const account = await this.accountRepository.save(newAccount);

    return await this.findOne(account.id);
  }
}
