import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Account } from "./entities/accounts.entity";
import { CreateAccountDto } from "./dto/create-account.dto";
import { BaseService } from "src/app/core/base.service";
import { REQUEST } from "@nestjs/core";
import { Request } from "express";
import { User } from "../users/entities/users.entity";
import { UpdateAccountDto } from "./dto/update-account.dto";

@Injectable()
export class AccountsService extends BaseService {
  constructor(
    @InjectRepository(Account)
    private readonly accountRepository: Repository<Account>,
    @InjectRepository(User)
    protected readonly usersRepository: Repository<User>,
    @Inject(REQUEST) protected readonly request: Request,
  ) {
    super(usersRepository, request);
  }

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
    try {
      const user = await this.getUserFromToken();

      if (user && user.roles && user.roles.includes("admin")) {
        return this.accountRepository.find({
          select: this.selectFields as (keyof Account)[],
        });
      }

      return this.accountRepository.find({
        where: { user },
        select: this.selectFields as (keyof Account)[],
      });
    } catch (error) {
      throw await this.handleException(error);
    }
  }

  async findOne(id: string): Promise<Account> {
    try {
      const user = await this.getUserFromToken();

      let condition = { id, user } as any;
      if (user && user.roles && user.roles.includes("admin")) {
        condition = { id } as any;
      }

      const account = await this.accountRepository.findOne({
        where: condition,
        select: this.selectFields as (keyof Account)[],
      });

      if (!account) {
        throw new NotFoundException("Account not found");
      }

      return account;
    } catch (error) {
      throw await this.handleException(error);
    }
  }

  async create(data: CreateAccountDto): Promise<Account> {
    try {
      const user = await this.getUserFromToken();

      const newAccount = this.accountRepository.create({
        name: data.name,
        current_balance: data.current_balance,
        status: data.status,
        icon: data.icon,
        user,
      });

      const account = await this.accountRepository.save(newAccount);

      return this.findOne(account.id);
    } catch (error) {
      throw await this.handleException(error);
    }
  }

  async update(id: string, data: UpdateAccountDto): Promise<Account> {
    try {
      const existAccount = await this.findOne(id);

      if (!existAccount) {
        throw new NotFoundException("Account not found");
      }

      this.accountRepository.merge(existAccount, data);
      return this.accountRepository.save(existAccount);
    } catch (error) {
      throw await this.handleException(error);
    }
  }

  async remove(id: string): Promise<any> {
    try {
      const existAccount = await this.findOne(id);

      if (!existAccount) {
        throw new NotFoundException("Account not found");
      }
      existAccount.status = 2;
      await this.accountRepository.save(existAccount);
      await this.accountRepository.softDelete(id);

      return { message: "Account deleted successfully!" };
    } catch (error) {
      throw await this.handleException(error);
    }
  }
}
