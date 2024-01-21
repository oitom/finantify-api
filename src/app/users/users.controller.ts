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
import { UsersService } from "./users.service";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { AuthGuard } from "@nestjs/passport";
import { Roles } from "../auth/decorators/roles.decorator";
import { RolesGuard } from "../auth/guard/roles.guard";

@Controller("users")
@UseGuards(AuthGuard("jwt"))
export default class UsersController {
  constructor(private readonly usersService: UsersService) {}
  @Get()
  async findAll() {
    return this.usersService.findAll();
  }

  @Get(":id")
  async findOne(@Param("id", new ParseUUIDPipe()) id: string) {
    return await this.usersService.findOne(id);
  }

  @Post()
  @Roles("admin")
  @UseGuards(RolesGuard)
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
