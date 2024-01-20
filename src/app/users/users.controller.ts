import { Controller, Get } from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('users')
export default class UsersController {
  constructor(private readonly usersService: UsersService) {}
  @Get()
  async findAll() {
    return this.usersService.findAll();
  }
}
