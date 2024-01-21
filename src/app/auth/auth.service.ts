import { Injectable, UnauthorizedException } from "@nestjs/common";
import { UsersService } from "../users/users.service";
import * as bcrypt from "bcrypt";
import { User } from "../users/entities/users.entity";
import { JwtService } from "@nestjs/jwt";

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string) {
    let user: User;

    try {
      user = await this.usersService.findOneOrFail({ where: { email } });
    } catch (err) {
      return null;
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) return null;

    return user;
  }

  async login(user: User) {
    const payload = { sub: user.id, email: user.email };

    return {
      token: this.jwtService.sign(payload),
      refresh_token: this.generateRefreshToken(user),
    };
  }

  async refreshTokens(refreshToken: string) {
    const decoded = this.jwtService.decode(refreshToken) as { sub: string };

    if (!decoded || !decoded.sub) {
      throw new UnauthorizedException("Invalid refresh token");
    }

    const user = await this.usersService.findOne(decoded.sub);
    if (!user) {
      throw new UnauthorizedException("User not found");
    }

    const accessToken = this.jwtService.sign({
      sub: user.id,
      email: user.email,
    });

    return {
      token: accessToken,
      refresh_token: this.generateRefreshToken(user),
    };
  }

  async verifyToken(token: string): Promise<User | null> {
    try {
      const decoded = this.jwtService.verify(token) as { sub: string };
      return this.usersService.findOne(decoded.sub);
    } catch (error) {
      return null;
    }
  }

  private generateRefreshToken(user: User) {
    return this.jwtService.sign(
      { sub: user.id },
      { expiresIn: process.env.JWT_REFRESH_TOKEN_EXPIRATION_TIME },
    );
  }
}
