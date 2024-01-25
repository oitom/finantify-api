import { Injectable, NotFoundException } from "@nestjs/common";
import { User } from "./entities/users.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { FindOneOptions, Repository } from "typeorm";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import * as bcrypt from "bcrypt";

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  async findAll(user: any): Promise<User[]> {
    if (user && user.roles && user.roles.includes("admin")) {
      return await this.usersRepository.find({
        select: ["id", "name", "email", "status", "roles"],
      });
    }

    return await this.usersRepository.find({
      select: ["id", "name", "email", "status"],
      where: { id: user.id },
    });
  }

  async findOne(id: string): Promise<User> {
    const user = await this.usersRepository.findOne({
      where: { id: id },
      select: ["id", "name", "email", "status"],
    });

    if (!user) {
      throw new NotFoundException("User not found");
    }

    return user;
  }

  async findOneOrFail(conditions: FindOneOptions<User>): Promise<User> {
    const user = await this.usersRepository.findOneOrFail(conditions);

    if (!user) {
      throw new NotFoundException("User not found");
    }

    return user;
  }

  async create(data: CreateUserDto): Promise<User> {
    const { name, email, password } = data;
    const hashedPassword = await bcrypt.hash(password, 10);
    const userToSave: CreateUserDto = {
      name,
      email,
      password: hashedPassword,
      status: 1,
    };
    const savedUser = await this.usersRepository.save(userToSave);

    return await this.findOne(savedUser.id);
  }

  async update(id: string, data: UpdateUserDto): Promise<User> {
    const existingUser = await this.findOne(id);

    if (!existingUser) {
      throw new NotFoundException("User not found");
    }

    if (data.password) {
      data.password = await bcrypt.hash(data.password, 10);
    }

    this.usersRepository.merge(existingUser, data);
    return await this.usersRepository.save(existingUser);
  }

  async remove(id: string): Promise<any> {
    const user = await this.findOne(id);

    if (!user) {
      throw new NotFoundException("User not found");
    }

    user.status = 2;
    await this.usersRepository.save(user);
    await this.usersRepository.softDelete(id);

    return { message: "User deleted successfully!" };
  }
}
