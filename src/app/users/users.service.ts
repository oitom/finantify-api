import { Injectable, NotFoundException } from "@nestjs/common";
import { User } from "./entities/users.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import * as bcrypt from "bcrypt";

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  async findAll(): Promise<User[]> {
    return await this.usersRepository.find();
  }

  async findOne(id: number): Promise<User> {
    const user = await this.usersRepository.findOne({
      where: { id: id },
    });

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
    return savedUser;
  }

  async update(id: number, data: UpdateUserDto): Promise<User> {
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
    return updatedUser;
  }

  async remove(id: number): Promise<any> {
    const user = await this.findOne(id);

    if (!user) {
      throw new NotFoundException("User not found");
    }

    await this.usersRepository.remove(user);

    const userDel = await this.usersRepository.findOne({
      where: { id: id },
    });

    if (userDel) {
      throw new NotFoundException("User not deleted");
    }

    return { message: "User deleted successfully!" };
  }
}
