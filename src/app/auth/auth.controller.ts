import {
  Controller,
  Post,
  Req,
  UnauthorizedException,
  UseGuards,
} from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { AuthService } from "./auth.service";
import { Request } from "express";

@Controller("auth")
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(AuthGuard("local"))
  @Post("login")
  async login(@Req() req: any) {
    return await this.authService.login(req.user);
  }

  @Post("refresh-token")
  async refreshToken(@Req() req: Request) {
    const refreshToken = req.headers.authorization?.split(" ")[1];

    if (!refreshToken) {
      throw new UnauthorizedException("Refresh token missing");
    }

    return this.authService.refreshTokens(refreshToken);
  }
}
