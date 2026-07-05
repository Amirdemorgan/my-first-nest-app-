import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';

import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';

import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AuthService {
  constructor(
    // سرویس JWT که Nest از طریق DI تزریق می‌کند
    private readonly jwtService: JwtService,

    // سرویس Prisma که خودمان ساخته‌ایم
    private readonly prisma: PrismaService,
  ) {}

  // ثبت نام
  async register(dto: RegisterDto) {
    const { email, password, name } = dto;

    // بررسی وجود ایمیل
    const existingUser = await this.prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw new ConflictException('Email is already registered');
    }

    // هش کردن پسورد
    const hashedPassword = await bcrypt.hash(password, 10);

    // ساخت کاربر
    const user = await this.prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });

    // تولید JWT
    return this.generateToken(user);
  }

  // ورود
  async login(dto: LoginDto) {
    const { email, password } = dto;

    // پیدا کردن کاربر
    const user = await this.prisma.user.findUnique({
      where: {
        email,
      },
    });

    // اگر کاربر نبود
    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }

    // مقایسه پسورد
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid email or password');
    }

    // تولید JWT
    return this.generateToken(user);
  }

  // ساخت Access Token
  private generateToken(user) {
    const payload = {
      sub: user.id, // شناسه کاربر
      email: user.email,
      role: user.role, // اگر در مدل User وجود داشته باشد
    };

    return {
      access_token: this.jwtService.sign(payload),

      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    };
  }
}
