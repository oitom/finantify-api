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
    const userToSave: CreateUserDto = { name, email, password: hashedPassword };
    const savedUser = await this.usersRepository.save(userToSave);

    return await this.findOne(savedUser.id);
  }

  async update(id: string, data: UpdateUserDto): Promise<User> {
    const existingUser = await this.findOne(id);

    if (!existingUser) {
      throw new NotFoundException("User not found");
    }

    const { name, email, password } = data;

    existingUser.name = name !== undefined ? name : existingUser.name;
    existingUser.email = email !== undefined ? email : existingUser.email;

    if (password !== undefined) {
      const hashedPassword = await bcrypt.hash(password, 10);
      existingUser.password = hashedPassword;
    }

    const updatedUser = await this.usersRepository.save(existingUser);

    return await this.findOne(updatedUser.id);
  }

  async remove(id: string): Promise<any> {
    const user = await this.findOne(id);

    if (!user) {
      throw new NotFoundException("User not found");
    }

    user.status = 3;
    await this.usersRepository.save(user);
    await this.usersRepository.softDelete(id);

    const userDel = await this.usersRepository.findOne({
      where: { id: id },
    });

    if (userDel) {
      throw new NotFoundException("User not deleted");
    }

    return { message: "User deleted successfully!" };
  }
}
