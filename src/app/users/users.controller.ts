import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  UseGuards,
} from "@nestjs/common";
import { UsersService } from "./users.service";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { AuthGuard } from "@nestjs/passport";
import { Roles } from "../auth/decorators/roles.decorator";
import { RolesGuard } from "../auth/guard/roles.guard";
import { REQUEST } from "@nestjs/core";
import { Request } from "express";

@Controller("users")
@UseGuards(AuthGuard("jwt"))
export default class UsersController {
  private user: any;

  constructor(
    private readonly usersService: UsersService,
    @Inject(REQUEST) protected readonly request: Request,
  ) {}

  @Get()
  async findAll() {
    const user = this.request.user as any;
    return this.usersService.findAll(user);
  }

  @Get(":id")
  async findOne(@Param("id", new ParseUUIDPipe()) id: string) {
    return await this.usersService.findOne(id);
  }

  @Roles("admin")
  @UseGuards(RolesGuard)
  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    return await this.usersService.create(createUserDto);
  }

  @Patch(":id")
  async update(
    @Param("id", new ParseUUIDPipe()) id: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return await this.usersService.update(id, updateUserDto);
  }

  @Delete(":id")
  async remove(@Param("id", new ParseUUIDPipe()) id: string) {
    return await this.usersService.remove(id);
  }
}
