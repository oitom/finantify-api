import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { REQUEST } from "@nestjs/core";
import { Request } from "express";
import { User } from "../users/entities/users.entity";
import { Repository } from "typeorm";

@Injectable()
export class BaseService {
  constructor(
    protected usersRepository: Repository<User>,
    @Inject(REQUEST) protected readonly request: Request,
  ) {}

  async getUserFromToken() {
    const userToken = this.request.user as any;

    if (!userToken) {
      throw new NotFoundException("Token not found");
    }

    const user = await this.usersRepository.findOne({
      where: { id: userToken.id },
    });

    if (!user) {
      throw new NotFoundException("User not found");
    }

    return user;
  }

  async handleException(error: Error) {
    if (error instanceof NotFoundException) {
      return new NotFoundException(error.message);
    } else if (error instanceof BadRequestException) {
      return new BadRequestException(error.message);
    } else {
      return new Error(error.message || "An unexpected error occurred.");
    }
  }
}
