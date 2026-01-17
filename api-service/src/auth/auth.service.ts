import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { User } from '../users/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  // 1. Валідація: повертаємо User без пароля або null
  async validateUser(
    email: string,
    pass: string,
  ): Promise<Omit<User, 'passwordHash'> | null> {
    const user = await this.usersService.findOneByEmail(email);

    if (user && (await bcrypt.compare(pass, user.passwordHash))) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { passwordHash, ...result } = user; // Вирізаємо пароль
      return result;
    }
    return null;
  }

  // 2. Логін: приймаємо вже перевіреного юзера
  // Ми явно вказуємо, що чекаємо об'єкт з id та email
  async login(user: { id: string; email: string }) {
    const payload = { email: user.email, sub: user.id };

    return {
      // Використовуємо signAsync, щоб метод був чесно асинхронним
      access_token: await this.jwtService.signAsync(payload),
    };
  }
}
