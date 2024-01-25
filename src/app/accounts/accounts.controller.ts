import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  UseGuards,
} from "@nestjs/common";
import { AccountsService } from "./accounts.service";
import { AuthGuard } from "@nestjs/passport";
import { CreateAccountDto } from "./dto/create-account.dto";
import { UpdateAccountDto } from "./dto/update-account.dto";

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

  @Patch(":id")
  async update(
    @Param("id", new ParseUUIDPipe()) id: string,
    @Body() data: UpdateAccountDto,
  ) {
    return this.accountsService.update(id, data);
  }

  @Delete(":id")
  async remove(@Param("id", new ParseUUIDPipe()) id: string) {
    console.log(id);
    return await this.accountsService.remove(id);
  }
}
