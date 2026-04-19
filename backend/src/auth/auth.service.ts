import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService
  ) {}

  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.usersService.findOne(email);
    // In a real app, use bcrypt to compare passwords
    if (user && user.password === pass) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: any) {
    const payload = { email: user.email, sub: user.userId, name: user.name, role: user.role, avatar: user.avatar };
    return {
      access_token: this.jwtService.sign(payload),
      user: payload
    };
  }

  async googleLogin(req) {
    if (!req.user) {
      return 'No user from google';
    }
    const user = await this.usersService.findOrCreateGoogleUser(req.user);
    const payload = { email: user.email, sub: user.userId, name: user.name, role: user.role, avatar: user.avatar };
    return {
      access_token: this.jwtService.sign(payload),
      user: payload
    };
  }
}
