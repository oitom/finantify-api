import { Body, Controller, Get, Param, Post, UseGuards } from "@nestjs/common";
import { AccountsService } from "./accounts.service";
import { AuthGuard } from "@nestjs/passport";
import { CreateAccountDto } from "./dto/create-account.dto";

@Controller("accounts")
@UseGuards(AuthGuard("jwt"))
export class AccountsController {
  constructor(private readonly accountsService: AccountsService) {}

  @Get()
  async findAll() {
    return this.accountsService.findAll();
  }

  @Get(":id")
  async findOne(@Param("id") id: string) {
    return this.accountsService.findOne(id);
  }

  @Post()
  async create(@Body() data: CreateAccountDto) {
    return this.accountsService.create(data);
  }
}
